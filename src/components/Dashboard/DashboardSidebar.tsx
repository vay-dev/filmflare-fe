import { LayoutDashboard, User, Activity, Settings, BarChart3, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: 'overview' | 'profile' | 'activity' | 'settings') => void;
  isAdmin: boolean;
}

const DashboardSidebar = ({ activeView, setActiveView, isAdmin }: DashboardSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard__sidebar">
      <div className="dashboard__sidebar-header">
        <BarChart3 size={28} />
        <h2>Dashboard</h2>
      </div>

      <nav className="dashboard__nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`dashboard__nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id as any)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="dashboard__sidebar-footer">
        {isAdmin && (
          <Link to="/upload" className="dashboard__quick-action">
            <Upload size={18} />
            <span>Upload Video</span>
          </Link>
        )}
        <Link to="/" className="dashboard__quick-action">
          <LayoutDashboard size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
