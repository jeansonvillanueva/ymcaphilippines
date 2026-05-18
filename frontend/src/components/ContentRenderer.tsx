import type { ContentBlock } from '../components/ContentBuilder';
import './ContentRenderer.css';

interface ContentRendererProps {
  contentBlocks: ContentBlock[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ contentBlocks }) => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return <p>No content available.</p>;
  }

  return (
    <div className="content-renderer">
      {contentBlocks.map((block) => {
        if (block.type === 'text') {
          return (
            <div
              key={block.id}
              className="content-text-block"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        } else if (block.type === 'image') {
          return (
            <div key={block.id} className="content-image-block">
              <img
                src={block.content}
                alt={block.alt || 'Article image'}
                className="content-image"
              />
              {block.alt && (
                <figcaption className="content-image-caption">{block.alt}</figcaption>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ContentRenderer;