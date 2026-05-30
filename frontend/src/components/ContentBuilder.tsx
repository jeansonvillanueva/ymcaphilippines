import { useEffect, useRef, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import './ContentBuilder.css';

export interface SlideshowImage {
  id: string;
  url: string;
  order: number;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'slideshow';
  content: string;
  alt?: string;
  slideshow_images?: SlideshowImage[];
}

interface ContentBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const compressImage = (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }),
          );
        } else {
          reject(new Error('Compression failed'));
        }
      }, file.type, quality);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

type BlockInserterProps = {
  insertIndex: number;
  onAddParagraph: (index: number) => void;
  onAddMedia: (index: number) => void;
  onAddGallery: (index: number) => void;
};

const BlockInserter: React.FC<BlockInserterProps> = ({
  insertIndex,
  onAddParagraph,
  onAddMedia,
  onAddGallery,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const choose = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`wp-post-editor__inserter ${open ? 'is-open' : ''}`}
    >
      <button
        type="button"
        className="wp-post-editor__inserter-btn"
        title="Add block"
        aria-label="Add block"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="wp-post-editor__inserter-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="wp-post-editor__inserter-option"
            onClick={() => choose(() => onAddParagraph(insertIndex))}
          >
            Paragraph
          </button>
          <button
            type="button"
            role="menuitem"
            className="wp-post-editor__inserter-option"
            onClick={() => choose(() => onAddMedia(insertIndex))}
          >
            Image
          </button>
          <button
            type="button"
            role="menuitem"
            className="wp-post-editor__inserter-option"
            onClick={() => choose(() => onAddGallery(insertIndex))}
          >
            Gallery
          </button>
        </div>
      )}
    </div>
  );
};

const ContentBuilder: React.FC<ContentBuilderProps> = ({ blocks, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const slideshowInputRef = useRef<HTMLInputElement>(null);
  const pendingInsertIndex = useRef<number | null>(null);

  const ensureInitialTextBlock = () => {
    if (blocks.length > 0) return;
    onChange([
      {
        id: createId('text'),
        type: 'text',
        content: '<p></p>',
      },
    ]);
  };

  const insertBlock = (index: number, block: ContentBlock) => {
    const next = [...blocks];
    next.splice(index, 0, block);
    onChange(next);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const readImageFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error('Image must be 2 MB or smaller'));
        return;
      }

      compressImage(file)
        .then((compressed) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') resolve(reader.result);
            else reject(new Error('Could not read image'));
          };
          reader.onerror = () => reject(new Error('Could not read image'));
          reader.readAsDataURL(compressed);
        })
        .catch(() => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') resolve(reader.result);
            else reject(new Error('Could not read image'));
          };
          reader.onerror = () => reject(new Error('Could not read image'));
          reader.readAsDataURL(file);
        });
    });

  const queueImageInsert = (index: number) => {
    pendingInsertIndex.current = index;
    imageInputRef.current?.click();
  };

  const queueSlideshowInsert = (index: number) => {
    pendingInsertIndex.current = index;
    slideshowInputRef.current?.click();
  };

  const handleImageFile = async (file: File) => {
    try {
      const dataUrl = await readImageFile(file);
      const block: ContentBlock = {
        id: createId('image'),
        type: 'image',
        content: dataUrl,
        alt: '',
      };
      const index = pendingInsertIndex.current ?? blocks.length;
      if (blocks.length === 0) {
        onChange([block]);
      } else {
        insertBlock(index, block);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      pendingInsertIndex.current = null;
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const readImageFiles = async (files: File[]): Promise<string[]> => {
    const results = await Promise.allSettled(files.map((file) => readImageFile(file)));
    const dataUrls: string[] = [];
    const errors: string[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        dataUrls.push(result.value);
      } else {
        errors.push(result.reason instanceof Error ? result.reason.message : 'Could not read image');
      }
    }
    if (errors.length > 0) {
      const summary =
        errors.length === 1
          ? errors[0]
          : `${errors.length} image(s) could not be added:\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? '\n…' : ''}`;
      alert(summary);
    }
    return dataUrls;
  };

  const buildSlideshowImages = (dataUrls: string[], startOrder: number): SlideshowImage[] =>
    dataUrls.map((url, i) => ({
      id: createId('slideshow-img'),
      url,
      order: startOrder + i,
    }));

  const handleSlideshowFiles = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const dataUrls = await readImageFiles(files);
      if (dataUrls.length === 0) return;

      const insertIndex = pendingInsertIndex.current ?? blocks.length;
      const existing = blocks[insertIndex];

      if (existing?.type === 'slideshow') {
        const current = existing.slideshow_images || [];
        updateBlock(insertIndex, {
          slideshow_images: [...current, ...buildSlideshowImages(dataUrls, current.length)],
        });
      } else {
        insertBlock(insertIndex, {
          id: createId('slideshow'),
          type: 'slideshow',
          content: '',
          slideshow_images: buildSlideshowImages(dataUrls, 0),
        });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      pendingInsertIndex.current = null;
      if (slideshowInputRef.current) slideshowInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const dataUrl = await readImageFile(file);
      updateBlock(index, { content: dataUrl });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  const handleSlideshowImagesUpload = async (index: number, files: File[]) => {
    if (files.length === 0) return;
    try {
      const dataUrls = await readImageFiles(files);
      if (dataUrls.length === 0) return;

      const current = blocks[index].slideshow_images || [];
      updateBlock(index, {
        slideshow_images: [...current, ...buildSlideshowImages(dataUrls, current.length)],
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    }
  };

  const handleDeleteSlideshowImage = (blockIndex: number, imageId: string) => {
    const updatedImages = (blocks[blockIndex].slideshow_images || [])
      .filter((img) => img.id !== imageId)
      .map((img, idx) => ({ ...img, order: idx }));
    updateBlock(blockIndex, { slideshow_images: updatedImages });
  };

  const addTextAt = (index: number) => {
    if (blocks.length === 0) {
      ensureInitialTextBlock();
      return;
    }
    insertBlock(index, {
      id: createId('text'),
      type: 'text',
      content: '<p></p>',
    });
  };

  const openAddMedia = (insertIndex: number) => {
    if (blocks.length === 0) {
      pendingInsertIndex.current = 0;
      imageInputRef.current?.click();
      return;
    }
    queueImageInsert(insertIndex);
  };

  const openAddGallery = (insertIndex: number) => {
    if (blocks.length === 0) {
      pendingInsertIndex.current = 0;
      slideshowInputRef.current?.click();
      return;
    }
    queueSlideshowInsert(insertIndex);
  };

  const inserterProps = {
    onAddParagraph: addTextAt,
    onAddMedia: openAddMedia,
    onAddGallery: openAddGallery,
  };

  return (
    <div className="wp-post-editor">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="wp-post-editor__hidden-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImageFile(file);
        }}
      />
      <input
        ref={slideshowInputRef}
        type="file"
        accept="image/*"
        multiple
        className="wp-post-editor__hidden-input"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) void handleSlideshowFiles(files);
        }}
      />

      <div className="wp-post-editor__canvas">
        {blocks.length === 0 ? (
          <div className="wp-post-editor__empty">
            <BlockInserter insertIndex={0} {...inserterProps} />
            <p className="wp-post-editor__empty-text">
              Click <strong>+</strong> to add a paragraph, image, or gallery.
            </p>
          </div>
        ) : (
          <>
            <BlockInserter insertIndex={0} {...inserterProps} />
            {blocks.map((block, index) => (
              <div key={block.id} className="wp-post-editor__flow">
                <section
                  className={`wp-post-editor__section ${draggedIndex === index ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    moveBlock(draggedIndex, index);
                    setDraggedIndex(index);
                  }}
                >
                  <div className="wp-post-editor__section-controls">
                    <button
                      type="button"
                      className="wp-post-editor__drag-handle"
                      draggable
                      title="Drag to reorder"
                      onDragStart={() => setDraggedIndex(index)}
                      onDragEnd={() => setDraggedIndex(null)}
                      aria-label="Drag to reorder"
                    >
                      ⋮⋮
                    </button>
                    <div className="wp-post-editor__section-actions">
                      <button
                        type="button"
                        className="wp-post-editor__icon-btn"
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => moveBlock(index, index - 1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="wp-post-editor__icon-btn"
                        title="Move down"
                        disabled={index === blocks.length - 1}
                        onClick={() => moveBlock(index, index + 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="wp-post-editor__icon-btn wp-post-editor__icon-btn--danger"
                        title="Remove"
                        onClick={() => deleteBlock(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {block.type === 'text' && (
                    <RichTextEditor
                      value={block.content}
                      onChange={(html) => updateBlock(index, { content: html })}
                      placeholder="Write your content…"
                      embedded
                      minHeight={index === 0 ? 280 : 160}
                    />
                  )}

                  {block.type === 'image' && (
                    <figure className="wp-post-editor__figure">
                      <input
                        type="file"
                        accept="image/*"
                        id={`image-upload-${block.id}`}
                        className="wp-post-editor__hidden-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleImageUpload(index, file);
                        }}
                      />
                      {!block.content ? (
                        <label htmlFor={`image-upload-${block.id}`} className="wp-post-editor__media-placeholder">
                          <span>Click to upload an image</span>
                          <small>Max 2 MB · auto-compressed</small>
                        </label>
                      ) : (
                        <>
                          <img src={block.content} alt={block.alt || ''} className="wp-post-editor__figure-image" />
                          <label htmlFor={`image-upload-${block.id}`} className="wp-post-editor__replace-btn">
                            Replace
                          </label>
                        </>
                      )}
                      <figcaption className="wp-post-editor__caption-field">
                        <label htmlFor={`image-alt-${block.id}`}>Caption / alt text</label>
                        <input
                          id={`image-alt-${block.id}`}
                          type="text"
                          value={block.alt || ''}
                          onChange={(e) => updateBlock(index, { alt: e.target.value })}
                          placeholder="Describe this image for accessibility"
                        />
                      </figcaption>
                    </figure>
                  )}

                  {block.type === 'slideshow' && (
                    <div className="wp-post-editor__gallery">
                      <div className="wp-post-editor__gallery-toolbar">
                        <label htmlFor={`slideshow-upload-${block.id}`} className="wp-post-editor__gallery-add">
                          Add to gallery
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          id={`slideshow-upload-${block.id}`}
                          className="wp-post-editor__hidden-input"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            if (files.length > 0) void handleSlideshowImagesUpload(index, files);
                            e.target.value = '';
                          }}
                        />
                        <span className="wp-post-editor__gallery-count">
                          {(block.slideshow_images?.length || 0)} image
                          {(block.slideshow_images?.length || 0) === 1 ? '' : 's'}
                        </span>
                      </div>

                      {block.slideshow_images && block.slideshow_images.length > 0 && (
                        <div className="wp-post-editor__gallery-grid">
                          {block.slideshow_images.map((image) => (
                            <div key={image.id} className="wp-post-editor__gallery-item">
                              <img src={image.url} alt={`Gallery image ${image.order + 1}`} />
                              <span className="wp-post-editor__gallery-order">{image.order + 1}</span>
                              <button
                                type="button"
                                className="wp-post-editor__gallery-remove"
                                onClick={() => handleDeleteSlideshowImage(index, image.id)}
                                aria-label={`Remove image ${image.order + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <BlockInserter insertIndex={index + 1} {...inserterProps} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentBuilder;
