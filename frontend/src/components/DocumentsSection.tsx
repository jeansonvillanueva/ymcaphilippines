import { useState, useEffect } from 'react';
import axios from 'axios';
import { PUBLIC_API_URL } from '../hooks/useApi';
import SubjectHeader from './SubjectHeader';

interface Document {
  id: number;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  created_at?: string;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${PUBLIC_API_URL}/documents`);
      if (Array.isArray(response.data)) {
        setDocuments(response.data);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    // Refetch when section becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDocuments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <section id="documents" className="page-section page-section--light documents-section">
        <div className="page-section__inner">
          <div className="documents-loading">Loading documents...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="documents" className="page-section page-section--white documents-section">
      <div className="page-section__inner">
        <SubjectHeader text="Documents" accent="s" />

        {error && (
          <div style={{ padding: '1rem', color: '#dc2626', textAlign: 'center' }}>
            Failed to load documents: {error}
          </div>
        )}

        {documents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: 'white', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>📭 No documents available yet</p>
            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0', color: '#999' }}>Check back soon for downloadable resources</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
              <div className="document-card__content">
                <h3 className="document-card__title">{doc.title}</h3>
                {doc.description && (
                  <p className="document-card__description">{doc.description}</p>
                )}
                <div className="document-card__meta">
                  <span className="document-card__type">{doc.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                  <span className="document-card__size">{formatFileSize(doc.file_size)}</span>
                </div>
              </div>
              <div className="document-card__actions">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="document-card__btn document-card__btn--view"
                  title={`View ${doc.file_name}`}
                >
                  View
                </a>
                <a
                  href={doc.file_url}
                  download={doc.file_name}
                  className="document-card__btn document-card__btn--download"
                  title={`Download ${doc.file_name}`}
                >
                  Download
                </a>
              </div>
            </div>
          ))}
          </div>
        )}

        <style>{`
          .documents-section {
            padding: 4rem var(--gap-xl);
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .documents-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .documents-title {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
            font-weight: 900;
            color: var(--ymca-navy);
          }

          .documents-subtitle {
            margin: 0;
            font-size: 1rem;
            color: var(--ymca-text);
          }

          .documents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }

          .document-card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid var(--ymca-red);
          }

          .document-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          }

          .document-card__icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .document-card__content {
            flex: 1;
            margin-bottom: 1rem;
          }

          .document-card__title {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--ymca-navy);
            word-break: break-word;
          }

          .document-card__description {
            margin: 0.5rem 0;
            font-size: 0.9rem;
            color: var(--ymca-text);
            line-height: 1.5;
          }

          .document-card__meta {
            display: flex;
            gap: 1rem;
            margin-top: 0.75rem;
            font-size: 0.85rem;
            color: #999;
          }

          .document-card__type {
            background: #f0f0f0;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: 500;
            text-transform: uppercase;
          }

          .document-card__size {
            display: flex;
            align-items: center;
          }

          .document-card__actions {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
          }

          .document-card__btn {
            flex: 1;
            padding: 0.75rem;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: background-color 0.2s, color 0.2s;
            display: block;
          }

          .document-card__btn--view {
            background-color: #007bff;
            color: white;
          }

          .document-card__btn--view:hover {
            background-color: #0056b3;
          }

          .document-card__btn--download {
            background-color: var(--ymca-red);
            color: white;
          }

          .document-card__btn--download:hover {
            background-color: #b01030;
          }

          .documents-loading {
            text-align: center;
            padding: 3rem;
            color: var(--ymca-text);
            font-size: 1.1rem;
          }

          @media (max-width: 768px) {
            .documents-grid {
              grid-template-columns: 1fr;
            }

            .documents-title {
              font-size: 1.5rem;
            }
          }

          .documents-section .subject-header__accent {
            color: var(--ymca-navy);
          }
        `}</style>
      </div>
    </section>
  );
}
