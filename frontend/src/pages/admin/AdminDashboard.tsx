import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import AdminVideos from './AdminVideos';
import AdminNews from './AdminNews';
import AdminCalendar from './AdminCalendar';
import AdminLocals from './AdminLocals';
import AdminStaff from './AdminStaff';
import AdminSubmissions from './AdminSubmissions';
import './AdminDashboard.css';

const LOGOUT_URL = `${ADMIN_API_URL}/logout`;

type AdminTab = 'videos' | 'news' | 'calendar' | 'locals' | 'staff' | 'dashboard';

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'videos', label: 'YMCA Videos', icon: '▶' },
  { id: 'news', label: 'Y Latest News', icon: '📄' },
  { id: 'calendar', label: 'Calendar of Activities', icon: '📅' },
  { id: 'locals', label: 'Find Your YMCA', icon: '📍' },
  { id: 'staff', label: 'Meet Our Family', icon: '👥' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__logo">YMCA</span>
            <span className="admin-sidebar__title">Admin</span>
          </div>

          <div className="admin-sidebar__menu">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-sidebar__item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="admin-sidebar__icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-main__header">
            <div>
              <p className="admin-main__subtitle">Site Management</p>
              <h1 className="admin-main__title">{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
            </div>
            <button onClick={handleLogout} className="admin-logout-button">
              Logout
            </button>
          </header>

          <section className="admin-content">
            {activeTab === 'videos' && <AdminVideos />}
            {activeTab === 'news' && <AdminNews />}
            {activeTab === 'calendar' && <AdminCalendar />}
            {activeTab === 'locals' && <AdminLocals />}
            {activeTab === 'staff' && <AdminStaff />}
            {activeTab === 'dashboard' && <AdminSubmissions />}
          </section>
        </main>
      </div>
    </div>
  );
}
