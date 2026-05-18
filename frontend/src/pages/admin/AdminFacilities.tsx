import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import './AdminFacilities.css';

interface FacilityItem {
  id?: number | string;
  name?: string;
  details?: string;
}

interface FacilityImage {
  id: number;
  local_id: string;
  image_url: string;
  image_order: number;
}

interface AdminFacilitiesProps {
  localId: string;
}

export default function AdminFacilities({ localId }: AdminFacilitiesProps) {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [images, setImages] = useState<FacilityImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, [localId]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ADMIN_API_URL}/facilities/${localId}`);
      
      // Convert old format to new array format if needed
      const facilitiesData = response.data.facilities || {};


      // Check if facilitiesData is already an array (new format)
      if (Array.isArray(facilitiesData)) {
        setFacilities(facilitiesData);
      } else {
        // Convert old object format with facility types to new array format
        // For now, we'll just initialize as empty since this is a UI restructuring
        setFacilities([]);
      }

      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setMessage({ type: 'error', text: 'Failed to load facilities' });
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (index: number, field: 'name' | 'details', value: string) => {
    setFacilities((prev) =>
      prev.map((facility, i) =>
        i === index
          ? { ...facility, [field]: value }
          : facility
      )
    );
  };

  const addFacility = () => {
    setFacilities((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        name: '',
        details: '',
      },
    ]);
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Convert new array format to backend format for saving
      const dataToSave: Record<string, any> = {
        facilities: facilities,
      };

      await axios.post(`${ADMIN_API_URL}/facilities/${localId}`, dataToSave);
      setMessage({ type: 'success', text: 'Facilities saved successfully' });
      await fetchFacilities();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving facilities:', error);
      setMessage({ type: 'error', text: 'Failed to save facilities' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      setMessage({ type: 'error', text: 'Maximum 5 images allowed' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', files[0]);

      const response = await axios.post(`${ADMIN_API_URL}/facilities/${localId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImages((prev) => [...prev, response.data]);
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`${ADMIN_API_URL}/facilities/${localId}/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setMessage({ type: 'success', text: 'Image deleted successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({ type: 'error', text: 'Failed to delete image' });
    }
  };

  if (loading && facilities.length === 0) {
    return <div className="admin-facilities-loading">Loading facilities...</div>;
  }

  const normalizeImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const apiBasePath = new URL(ADMIN_API_URL).pathname.replace(/\/admin$/, '');
    const siteBasePath = apiBasePath.replace(/\/php-api$/, '');
    if (url.startsWith(apiBasePath)) return url;
    if (url.startsWith('/backend/uploads/')) return url;
    if (url.startsWith('/uploads/')) return `${siteBasePath}/backend${url}`;
    if (url.startsWith('/php-api/uploads/')) {
      return `${siteBasePath}/backend/${url.substring('/php-api/uploads/'.length)}`;
    }
    return url;
  };

  return (
    <div className="admin-facilities">
      <h2>Manage Facilities for {localId}</h2>

      {message && <div className={`admin-facilities-message ${message.type}`}>{message.text}</div>}

      <div className="facilities-editor" style={{ gridColumn: '1 / -1', marginTop: '2rem', padding: '1rem', background: '#f5f9ff', borderRadius: '6px' }}>
        <h4 style={{ marginBottom: '1rem' }}>Manage Facilities</h4>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Add facilities by entering a name and optional details. This is similar to how you manage Pillar Programs.
        </p>

        {facilities.length > 0 ? (
          facilities.map((facility, index) => (
            <div key={facility.id} style={{ marginBottom: '1rem', padding: '0.75rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #dce3eb' }}>
              <div className="form-group">
                <label>Facility Name</label>
                <input
                  type="text"
                  placeholder="e.g., Building A, Swimming Pool, Gymnasium"
                  value={facility.name || ''}
                  onChange={(e) => handleFacilityChange(index, 'name', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Enter Details (optional)</label>
                <textarea
                  placeholder="e.g., Modern facility with 3 floors, air-conditioned"
                  rows={3}
                  value={facility.details || ''}
                  onChange={(e) => handleFacilityChange(index, 'details', e.target.value)}
                  style={{ width: '100%', minHeight: '72px' }}
                />
              </div>
              <button
                type="button"
                className="btn btn-tertiary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => removeFacility(index)}
              >
                Remove Facility
              </button>
            </div>
          ))
        ) : (
          <p>No facilities configured yet. Click "Add Facility" to add one.</p>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addFacility}
          style={{ marginBottom: '1rem' }}
        >
          + Add Facility
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Facilities'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3>Facility Images (Optional - Max 5 images)</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Upload up to 5 images to display in the slideshow
        </p>

        <div style={{
          background: '#f9fafb',
          padding: '2rem',
          borderRadius: '20px',
          border: '1px solid #e6ebfb',
          marginBottom: '1.5rem'
        }}>
          <label htmlFor="image-input" className="btn btn-secondary" style={{ cursor: 'pointer', marginRight: '1rem' }}>
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || images.length >= 5}
            style={{ display: 'none' }}
          />
          <span style={{ color: '#666', fontSize: '0.95rem' }}>
            {images.length}/5 images uploaded
          </span>
        </div>

        {images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {images.map((image) => (
              <div
                key={image.id}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  background: '#f0f0f0',
                  border: '1px solid #e0e0e0'
                }}
              >
                <img
                  src={normalizeImageUrl(image.image_url)}
                  alt={`Facility ${image.image_order + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  title="Delete image"
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
