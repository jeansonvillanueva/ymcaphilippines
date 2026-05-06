import { useState, useEffect } from 'react';
import axios from 'axios';
import { PUBLIC_API_URL } from '../hooks/useApi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SubjectHeader from '../components/SubjectHeader';
import '../styles/design-system.css';
import './Documents.css';

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

export default function DocumentsPage() {
  const ref = useScrollReveal<HTMLDivElement>();
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
    
    // Refetch when page becomes visible
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
      <div className="documents-page" ref={ref}>
        <section className="page-section page-section--light documents-section">
          <div className="page-section__inner">
            <div className="documents-loading">Loading documents...</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="documents-page" ref={ref}>
      <section className="page-section page-section--white documents-section">
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
        </div>
      </section>
    </div>
  );
}
