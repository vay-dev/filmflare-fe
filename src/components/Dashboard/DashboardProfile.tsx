import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Settings } from 'lucide-react';

const DashboardProfile = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard__profile">
      <div className="dashboard__profile-header">
        <div className="dashboard__profile-avatar">
          {user?.profile_image ? (
            <img src={user.profile_image} alt={user.username} />
          ) : (
            <User size={48} />
          )}
        </div>
        <div className="dashboard__profile-info">
          <h2>{user?.username}</h2>
          <p className="dashboard__profile-role">
            {isAdmin ? 'Administrator' : 'User'}
          </p>
        </div>
        <button
          className="dashboard__edit-profile-btn"
          onClick={() => navigate('/profile')}
          title="Edit Profile"
        >
          <Settings size={18} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="dashboard__profile-details">
        <div className="dashboard__detail-card">
          <div className="dashboard__detail-icon">
            <User size={20} />
          </div>
          <div>
            <label>Username</label>
            <p>{user?.username}</p>
          </div>
        </div>

        <div className="dashboard__detail-card">
          <div className="dashboard__detail-icon">
            <Mail size={20} />
          </div>
          <div>
            <label>Email</label>
            <p>{user?.email || 'Not provided'}</p>
          </div>
        </div>

        <div className="dashboard__detail-card">
          <div className="dashboard__detail-icon">
            <Calendar size={20} />
          </div>
          <div>
            <label>Member Since</label>
            <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </div>

        <div className="dashboard__detail-card">
          <div className="dashboard__detail-icon">
            <Shield size={20} />
          </div>
          <div>
            <label>Account Type</label>
            <p>{isAdmin ? 'Premium Admin' : 'Standard User'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard__profile-stats">
        <h3>Account Statistics</h3>
        <div className="dashboard__stats-list">
          <div className="dashboard__stat-item">
            <span className="dashboard__stat-label">Total Videos Watched</span>
            <span className="dashboard__stat-number">24</span>
          </div>
          <div className="dashboard__stat-item">
            <span className="dashboard__stat-label">Favorites</span>
            <span className="dashboard__stat-number">12</span>
          </div>
          <div className="dashboard__stat-item">
            <span className="dashboard__stat-label">Downloads</span>
            <span className="dashboard__stat-number">8</span>
          </div>
          <div className="dashboard__stat-item">
            <span className="dashboard__stat-label">Total Watch Time</span>
            <span className="dashboard__stat-number">32h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
