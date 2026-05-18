import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface Document {
  id?: number;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  display_order?: number;
  created_at?: string;
}

export default function AdminDocuments() {
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [form, setForm] = useState<Document>({
    title: '',
    description: '',
    display_order: 0,
  });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/documents`;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      if (Array.isArray(response.data)) {
        setDocumentsList(response.data);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      setMessage({ type: 'error', text: 'Failed to load documents' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed' });
      return;
    }

    // Check file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'File must be 10 MB or smaller' });
      return;
    }

    setFileToUpload(file);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    if (!editingId && !fileToUpload) {
      setMessage({ type: 'error', text: 'File is required for new documents' });
      return;
    }

    try {
      if (editingId) {
        // Update existing document
        await axios.put(`${API_URL}/${editingId}`, form, {
          withCredentials: true,
        });
        setMessage({ type: 'success', text: 'Document updated successfully!' });
      } else {
        // Create new document with file upload
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description || '');
        formData.append('display_order', form.display_order?.toString() || '0');
        formData.append('file', fileToUpload!);

        const response = await axios.post(API_URL, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.id) {
          setMessage({ type: 'success', text: 'Document uploaded successfully!' });
        }
      }

      // Reset form and refresh list
      setForm({ title: '', description: '', display_order: 0 });
      setFileToUpload(null);
      setEditingId(null);

      // Clear file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchDocuments();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to save document';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleEdit = (doc: Document) => {
    setForm({
      title: doc.title,
      description: doc.description,
      display_order: doc.display_order || 0,
    });
    setEditingId(doc.id || null);
    setFileToUpload(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      setMessage({ type: 'success', text: 'Document deleted successfully!' });
      fetchDocuments();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to delete document';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="admin-documents">
      <style>{`
        .admin-documents {
          padding: 0;
        }
        .admin-form-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .admin-form-section h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          color: #333;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group textarea,
        .form-group input[type="file"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
        }
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn-primary {
          background-color: #dc143c;
          color: white;
        }
        .btn-primary:hover {
          background-color: #b01030;
        }
        .btn-secondary {
          background-color: #888;
          color: white;
        }
        .btn-secondary:hover {
          background-color: #666;
        }
        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .documents-list {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .admin-list-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-list-table thead {
          background-color: #f5f5f5;
        }
        .admin-list-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        .admin-list-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        .admin-list-table tbody tr:hover {
          background-color: #fafafa;
        }
        .btn-small {
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
        }
        .btn-edit {
          background-color: #007bff;
          color: white;
        }
        .btn-edit:hover {
          background-color: #0056b3;
        }
        .btn-delete {
          background-color: #dc2626;
          color: white;
        }
        .btn-delete:hover {
          background-color: #b91c1c;
        }
        .file-link {
          color: #007bff;
          text-decoration: none;
        }
        .file-link:hover {
          text-decoration: underline;
        }
        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-form-section">
        <h2>{editingId ? 'Edit Document' : 'Upload New Document'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Document Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., YMCA Annual Report 2024"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Brief description of the document"
            />
          </div>

          <div className="form-group">
            <label htmlFor="display-order">Display Order</label>
            <input
              id="display-order"
              type="number"
              name="display_order"
              value={form.display_order || 0}
              onChange={handleChange}
              min="0"
            />
          </div>

          {!editingId && (
            <div className="form-group">
              <label htmlFor="file-input">Select File * (PDF, DOC, DOCX, XLS, XLSX, TXT)</label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              {fileToUpload && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  Selected: {fileToUpload.name} ({formatFileSize(fileToUpload.size)})
                </p>
              )}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Document' : 'Upload Document'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', description: '', display_order: 0 });
                  setFileToUpload(null);
                }}
                className="btn btn-secondary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Documents List</h3>
      {loading ? (
        <div className="loading">Loading documents...</div>
      ) : documentsList.length === 0 ? (
        <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No documents yet. Upload one to get started!</p>
      ) : (
        <div className="documents-list">
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentsList.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="file-link">
                      {doc.file_name}
                    </a>
                  </td>
                  <td>{doc.file_type?.split('/')[1] || 'N/A'}</td>
                  <td>{formatFileSize(doc.file_size)}</td>
                  <td>{doc.display_order}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="btn btn-edit btn-small"
                      style={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(doc.id!)} className="btn btn-delete btn-small">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
