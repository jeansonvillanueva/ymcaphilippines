import { useState } from 'react';
import AdminVideos from './AdminVideos';
import AdminNews from './AdminNews';
import AdminCalendar from './AdminCalendar';
import AdminLocals from './AdminLocals';
import AdminStaff from './AdminStaff';
import AdminSubmissions from './AdminSubmissions';
import './AdminDashboard.css';

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
