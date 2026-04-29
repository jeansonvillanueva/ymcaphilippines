import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import './AdminFacilities.css';

interface Facility {
  [key: string]: string | number | null | undefined | boolean;
  buildings?: string;
  buildings_enabled?: boolean;
  room_accommodations?: string;
  room_accommodations_enabled?: boolean;
  basketball_court?: string;
  basketball_court_enabled?: boolean;
  swimming_pool?: string;
  swimming_pool_enabled?: boolean;
  fitness_gym?: string;
  fitness_gym_enabled?: boolean;
  function_hall?: string;
  function_hall_enabled?: boolean;
  badminton_court?: string;
  badminton_court_enabled?: boolean;
  tennis_court?: string;
  tennis_court_enabled?: boolean;
  martial_arts?: string;
  martial_arts_enabled?: boolean;
  spaces?: string;
  spaces_enabled?: boolean;
  other_facilities?: string;
  other_facilities_enabled?: boolean;
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

interface FacilityField {
  key: string;
  label: string;
  enabledKey: string;
}

export default function AdminFacilities({ localId }: AdminFacilitiesProps) {
  const [facilities, setFacilities] = useState<Facility>({});
  const [images, setImages] = useState<FacilityImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const facilityFields: FacilityField[] = [
    { key: 'buildings', label: 'Buildings', enabledKey: 'buildings_enabled' },
    { key: 'room_accommodations', label: 'Room Accommodations', enabledKey: 'room_accommodations_enabled' },
    { key: 'basketball_court', label: 'Basketball Court', enabledKey: 'basketball_court_enabled' },
    { key: 'swimming_pool', label: 'Swimming Pool', enabledKey: 'swimming_pool_enabled' },
    { key: 'fitness_gym', label: 'Fitness Gym', enabledKey: 'fitness_gym_enabled' },
    { key: 'function_hall', label: 'Function Hall', enabledKey: 'function_hall_enabled' },
    { key: 'badminton_court', label: 'Badminton Court', enabledKey: 'badminton_court_enabled' },
    { key: 'tennis_court', label: 'Tennis Court', enabledKey: 'tennis_court_enabled' },
    { key: 'martial_arts', label: 'Martial Arts', enabledKey: 'martial_arts_enabled' },
    { key: 'spaces', label: 'Spaces', enabledKey: 'spaces_enabled' },
    { key: 'other_facilities', label: 'Other Facilities', enabledKey: 'other_facilities_enabled' },
  ];

  useEffect(() => {
    fetchFacilities();
  }, [localId]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ADMIN_API_URL}/facilities/${localId}`);
      
      // Initialize facilities with all fields properly set
      const facilitiesData = response.data.facilities || {};
      const processedFacilities: Facility = {};
      
      // Process each facility field to convert database values (0/1) to boolean
      facilityFields.forEach((field) => {
        processedFacilities[field.key] = facilitiesData[field.key] || '';
        // Convert database 0/1 values to boolean
        processedFacilities[field.enabledKey] = facilitiesData[field.enabledKey] ? true : false;
      });
      
      setFacilities(processedFacilities);
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setMessage({ type: 'error', text: 'Failed to load facilities' });
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (key: string, value: string | boolean) => {
    setFacilities((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Prepare data with only the relevant facility fields
      const dataToSave: Record<string, any> = {};
      facilityFields.forEach((field) => {
        dataToSave[field.key] = facilities[field.key as keyof Facility] || '';
        dataToSave[field.enabledKey] = facilities[field.enabledKey as keyof Facility] ? true : false;
      });
      
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

  if (loading && Object.keys(facilities).length === 0) {
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

      <form className="admin-form expanded" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h3>Manage Facilities</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Check the facilities you want to display to users. You can add details for each facility (optional).
          </p>
        </div>

        {facilityFields.map((field) => {
          const isEnabled = facilities[field.enabledKey as keyof Facility] as boolean || false;
          const value = (facilities[field.key as keyof Facility] as string) || '';

          return (
            <div key={field.key} style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  id={field.enabledKey}
                  checked={isEnabled}
                  onChange={(e) => handleFacilityChange(field.enabledKey, e.target.checked)}
                  style={{ marginTop: '0.5rem', width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <label htmlFor={field.enabledKey} style={{ fontWeight: '600', cursor: 'pointer', display: 'block', marginBottom: '0.5rem' }}>
                    {field.label}
                  </label>
                  {isEnabled && (
                    <input
                      type="text"
                      placeholder={`Enter ${field.label} details (optional)`}
                      value={value}
                      onChange={(e) => handleFacilityChange(field.key, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={handleSave}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Facilities'}
          </button>
        </div>
      </form>

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
