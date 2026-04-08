import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface Staff {
  id?: number;
  name: string;
  position: string;
  imageUrl?: string;
  departmentGroup?: string;
  sequenceOrder?: number;
}

export default function AdminStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [form, setForm] = useState<Staff>({
    name: '',
    position: '',
    imageUrl: '',
    departmentGroup: '',
    sequenceOrder: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/staff`;

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(API_URL);
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setMessage({ type: 'error', text: 'Failed to load staff' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.position.trim()) {
      setMessage({ type: 'error', text: 'Name and position are required' });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage({ type: 'success', text: 'Staff updated successfully' });
      } else {
        await axios.post(API_URL, form);
        setMessage({ type: 'success', text: 'Staff added successfully' });
      }
      setForm({
        name: '',
        position: '',
        imageUrl: '',
        departmentGroup: '',
        sequenceOrder: 0,
      });
      setEditingId(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      setMessage({ type: 'error', text: 'Failed to save staff' });
    }
  };

  const handleEdit = (staff: Staff) => {
    setForm(staff);
    setEditingId(staff.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ type: 'success', text: 'Staff deleted successfully' });
        fetchStaff();
        if (editingId === id) {
          setForm({
            name: '',
            position: '',
            imageUrl: '',
            departmentGroup: '',
            sequenceOrder: 0,
          });
          setEditingId(null);
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        setMessage({ type: 'error', text: 'Failed to delete staff' });
      }
    }
  };

  if (loading) return <div className="loading">Loading staff...</div>;

  // Group staff by department
  const staffByDept: Record<string, Staff[]> = {};
  staffList.forEach((staff) => {
    const dept = staff.departmentGroup || 'Other';
    if (!staffByDept[dept]) staffByDept[dept] = [];
    staffByDept[dept].push(staff);
  });

  const departments = [
    'National General Secretary',
    'National Program Secretary',
    'Secretary for Finance',
    'Secretary for Member Association',
    'Secretary for Operation',
    'Other'
  ];

  return (
    <div className="admin-section">
      <h2>Manage Meet Our Family (Staff)</h2>
      <p className="admin-section-description">
        Add or modify staff members, their photos, names, positions, and department groups.
      </p>

      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <form className="admin-form expanded" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Position *</label>
          <input
            type="text"
            name="position"
            placeholder="e.g., OIC – National General Secretary"
            value={form.position}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Department/Group</label>
          <select name="departmentGroup" value={form.departmentGroup || ''} onChange={handleChange}>
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Display Order</label>
          <input
            type="number"
            name="sequenceOrder"
            value={form.sequenceOrder || 0}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Photo URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://..."
            value={form.imageUrl || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Staff' : 'Add Staff'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  name: '',
                  position: '',
                  imageUrl: '',
                  departmentGroup: '',
                  sequenceOrder: 0,
                });
                setEditingId(null);
              }}
              className="btn btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>Staff Directory by Department</h3>
      {staffList.length === 0 ? (
        <p>No staff members yet. Add one to get started!</p>
      ) : (
        <div className="staff-by-dept">
          {departments.map((dept) => {
            const deptStaff = staffByDept[dept];
            if (!deptStaff || deptStaff.length === 0) return null;

            return (
              <div key={dept} className="dept-section">
                <h4 className="dept-name">{dept}</h4>
                <div className="staff-grid">
                  {deptStaff
                    .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0))
                    .map((staff) => (
                      <div key={staff.id} className="staff-card">
                        {staff.imageUrl && (
                          <div className="staff-photo">
                            <img src={staff.imageUrl} alt={staff.name} />
                          </div>
                        )}
                        <div className="staff-info">
                          <h5>{staff.name}</h5>
                          <p className="staff-position">{staff.position}</p>
                        </div>
                        <div className="staff-actions">
                          <button onClick={() => handleEdit(staff)} className="btn btn-secondary btn-small">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(staff.id!)} className="btn btn-danger btn-small">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .dept-section {
          margin-bottom: 2rem;
        }

        .dept-name {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #667eea;
          color: #667eea;
        }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .staff-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
          }
        }

        .staff-photo {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f0f0f0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .staff-info {
          padding: 1rem;

          h5 {
            margin: 0 0 0.5rem;
            font-size: 1.05rem;
          }
        }

        .staff-position {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .staff-actions {
          padding: 0 1rem 1rem;
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
