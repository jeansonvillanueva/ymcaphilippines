import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import './ContentBuilder.css';

export interface SlideshowImage {
  id: string; // Temporary ID during edit, server ID after save
  url: string;
  order: number;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'slideshow';
  content: string; // HTML for text blocks, image URL for image blocks, empty for slideshow
  alt?: string; // For images
  slideshow_images?: SlideshowImage[]; // For slideshow blocks
}

interface ContentBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

// Image compression utility
const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1200, maxHeight: number = 1200): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Compression failed'));
        }
      }, file.type, quality);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

const ContentBuilder: React.FC<ContentBuilderProps> = ({ blocks, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: '<p>Enter your text here...</p>',
    };
    onChange([...blocks, newBlock]);
  };

  const addImageBlock = () => {
    const newBlock: ContentBlock = {
      id: `image-${Date.now()}`,
      type: 'image',
      content: '',
      alt: '',
    };
    onChange([...blocks, newBlock]);
  };

  const addSlideshowBlock = () => {
    const newBlock: ContentBlock = {
      id: `slideshow-${Date.now()}`,
      type: 'slideshow',
      content: '',
      slideshow_images: [],
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    moveBlock(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageUpload = (index: number, file: File) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
      alert('Image must be 2 MB or smaller');
      return;
    }

    // Compress image
    compressImage(file, 0.8, 1200, 1200).then((compressedFile) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateBlock(index, { content: reader.result });
        }
      };
      reader.readAsDataURL(compressedFile);
    }).catch((error) => {
      console.error('Image compression failed:', error);
      // Fallback to original file
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateBlock(index, { content: reader.result });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSlideshowImageUpload = (index: number, file: File) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
      alert('Image must be 2 MB or smaller');
      return;
    }

    // Compress image
    compressImage(file, 0.8, 1200, 1200).then((compressedFile) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImage: SlideshowImage = {
            id: `slideshow-img-${Date.now()}`,
            url: reader.result as string,
            order: blocks[index].slideshow_images?.length || 0,
          };
          const updatedImages = [...(blocks[index].slideshow_images || []), newImage];
          updateBlock(index, { slideshow_images: updatedImages });
        }
      };
      reader.readAsDataURL(compressedFile);
    }).catch((error) => {
      console.error('Image compression failed:', error);
      // Fallback to original file
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImage: SlideshowImage = {
            id: `slideshow-img-${Date.now()}`,
            url: reader.result as string,
            order: blocks[index].slideshow_images?.length || 0,
          };
          const updatedImages = [...(blocks[index].slideshow_images || []), newImage];
          updateBlock(index, { slideshow_images: updatedImages });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteSlideshowImage = (blockIndex: number, imageId: string) => {
    const updatedImages = (blocks[blockIndex].slideshow_images || [])
      .filter((img) => img.id !== imageId)
      .map((img, idx) => ({ ...img, order: idx }));
    updateBlock(blockIndex, { slideshow_images: updatedImages });
  };

  return (
    <div className="content-builder">
      <div className="content-builder__toolbar">
        <button type="button" onClick={addTextBlock} className="btn btn-secondary">
          + Add Text Block
        </button>
        <button type="button" onClick={addImageBlock} className="btn btn-secondary">
          + Add Image Block
        </button>
        <button type="button" onClick={addSlideshowBlock} className="btn btn-secondary">
          + Add Image Slide Show Block
        </button>
      </div>

      <div className="content-builder__blocks">
        {blocks.length === 0 ? (
          <div className="content-builder__empty">
            <p>No content blocks yet. Add text or image blocks above.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              className={`content-builder__block ${draggedIndex === index ? 'dragging' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="content-builder__block-header">
                <span className="content-builder__block-type">
                  {block.type === 'text' ? '📝 Text' : block.type === 'image' ? '🖼️ Image' : '🎬 Slideshow'}
                </span>
                <div className="content-builder__block-actions">
                  <button
                    type="button"
                    onClick={() => deleteBlock(index)}
                    className="btn btn-danger btn-sm"
                    title="Delete block"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="content-builder__block-content">
                {block.type === 'text' ? (
                  <RichTextEditor
                    value={block.content}
                    onChange={(html) => updateBlock(index, { content: html })}
                    placeholder="Enter text content..."
                  />
                ) : block.type === 'image' ? (
                  <div className="image-block">
                    <div className="image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                        style={{ display: 'none' }}
                        id={`image-upload-${block.id}`}
                      />
                      {!block.content ? (
                        <label htmlFor={`image-upload-${block.id}`} className="image-upload__label">
                          <div className="image-upload__placeholder">
                            <span>Click to upload image</span>
                            <small>Max 2MB (auto-compressed)</small>
                          </div>
                        </label>
                      ) : (
                        <div className="image-preview">
                          <img src={block.content} alt={block.alt || 'Content image'} />
                          <label htmlFor={`image-upload-${block.id}`} className="image-replace-btn">
                            Replace Image
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="image-alt-input">
                      <label htmlFor={`image-alt-${block.id}`}>Alt text:</label>
                      <input
                        id={`image-alt-${block.id}`}
                        type="text"
                        value={block.alt || ''}
                        onChange={(e) => updateBlock(index, { alt: e.target.value })}
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="slideshow-block">
                    <div className="slideshow-upload">
                      <label htmlFor={`slideshow-upload-${block.id}`} className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                        + Add Image to Slideshow
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSlideshowImageUpload(index, file);
                        }}
                        style={{ display: 'none' }}
                        id={`slideshow-upload-${block.id}`}
                      />
                      <span style={{ color: '#666', fontSize: '0.95rem' }}>
                        {block.slideshow_images?.length || 0}/5 slideshow images
                      </span>
                    </div>

                    {block.slideshow_images && block.slideshow_images.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '1rem',
                        marginTop: '1rem'
                      }}>
                        {block.slideshow_images.map((image) => (
                          <div
                            key={image.id}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              aspectRatio: '1',
                              background: '#f0f0f0',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <img
                              src={image.url}
                              alt={`Slideshow image ${image.order + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '0.25rem',
                              textAlign: 'center',
                              fontSize: '0.75rem'
                            }}>
                              #{image.order + 1}
                            </div>
                            <button
                              onClick={() => handleDeleteSlideshowImage(index, image.id)}
                              style={{
                                position: 'absolute',
                                top: '0.25rem',
                                right: '0.25rem',
                                background: 'rgba(220, 53, 69, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                transition: 'background 0.2s',
                                padding: 0
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 1)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)'}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {blocks.length > 0 && (
        <div className="content-builder__help">
          <small>💡 Drag blocks to reorder them. Add text, image, and slideshow blocks to create your article content. Max 5 images per slideshow.</small>
        </div>
      )}
    </div>
  );
};

export default ContentBuilder;