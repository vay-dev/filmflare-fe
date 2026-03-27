import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardOverview from './DashboardOverview';
import DashboardProfile from './DashboardProfile';
import DashboardActivity from './DashboardActivity';
import DashboardSettings from './DashboardSettings';
import './dashboard.scss';

type DashboardView = 'overview' | 'profile' | 'activity' | 'settings';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<DashboardView>('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'profile':
        return <DashboardProfile />;
      case 'activity':
        return <DashboardActivity />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="dashboard">
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isAdmin={isAdmin}
      />
      <div className="dashboard__content">
        <div className="dashboard__header">
          <h1 className="dashboard__title">
            {activeView === 'overview' && 'Dashboard Overview'}
            {activeView === 'profile' && 'My Profile'}
            {activeView === 'activity' && 'Activity History'}
            {activeView === 'settings' && 'Settings'}
          </h1>
          <div className="dashboard__user-badge">
            <span className="dashboard__username">{user?.username}</span>
            {isAdmin && <span className="dashboard__admin-badge">Admin</span>}
          </div>
        </div>
        {renderView()}
      </div>
    </div>
  );
};

export default Dashboard;
