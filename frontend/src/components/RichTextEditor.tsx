import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useEffect } from 'react';
import '../styles/RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [isReady, setIsReady] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-input',
      },
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading editor...</div>;
  }

  const applyFormat = (command: string) => {
    if (editor) {
      if (command === 'toggleBold') editor.chain().focus().toggleBold().run();
      else if (command === 'toggleItalic') editor.chain().focus().toggleItalic().run();
      else if (command === 'toggleStrike') editor.chain().focus().toggleStrike().run();
      else if (command === 'toggleUnderline') {
        // Using paragraph mark as underline substitute since Underline extension needs to be added
        editor.chain().focus().setParagraph().run();
      } else if (command === 'toggleBulletList') editor.chain().focus().toggleBulletList().run();
      else if (command === 'toggleOrderedList') editor.chain().focus().toggleOrderedList().run();
      else if (command === 'toggleBlockquote') editor.chain().focus().toggleBlockquote().run();
      else if (command === 'toggleHeading1') editor.chain().focus().toggleHeading({ level: 1 }).run();
      else if (command === 'toggleHeading2') editor.chain().focus().toggleHeading({ level: 2 }).run();
      else if (command === 'increaseIndent') editor.chain().focus().sinkListItem('listItem').run();
      else if (command === 'decreaseIndent') editor.chain().focus().liftListItem('listItem').run();
      else if (command === 'clear') editor.chain().focus().clearNodes().run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor" style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => applyFormat('toggleHeading1')}
            className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => applyFormat('toggleHeading2')}
            className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Heading 2"
          >
            H2
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => applyFormat('toggleBold')}
            className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('toggleItalic')}
            className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('toggleStrike')}
            className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => applyFormat('toggleBulletList')}
            className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => applyFormat('toggleOrderedList')}
            className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
            title="Ordered List"
          >
            1. List
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => applyFormat('toggleBlockquote')}
            className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
            title="Quote"
          >
            &quot; Quote
          </button>
        </div>

        <div className="toolbar-group">
          <button type="button" onClick={() => applyFormat('clear')} className="toolbar-btn" title="Clear Formatting">
            ↺ Clear
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
