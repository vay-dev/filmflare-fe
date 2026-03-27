import { useState, useEffect } from 'react';
import { Heart, Eye, Download, TrendingUp, Film, Clock, Activity } from 'lucide-react';
import { videoService } from '../../services/videoService';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    favorites: 0,
    watchHistory: 0,
    downloads: 0,
    totalWatchTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [favorites] = await Promise.all([
          videoService.getFavorites(),
        ]);

        setStats({
          favorites: favorites.length,
          watchHistory: 0,
          downloads: 0,
          totalWatchTime: 0,
        });

        setRecentActivity([
          { type: 'favorite', title: 'Added to favorites', time: '2 hours ago', icon: Heart },
          { type: 'watch', title: 'Watched a video', time: '5 hours ago', icon: Eye },
          { type: 'download', title: 'Downloaded a video', time: '1 day ago', icon: Download },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Favorites', value: stats.favorites, icon: Heart, color: '#e94560', trend: '+12%' },
    { label: 'Watch History', value: stats.watchHistory, icon: Eye, color: '#4a9eff', trend: '+8%' },
    { label: 'Downloads', value: stats.downloads, icon: Download, color: '#00d9ff', trend: '+5%' },
    { label: 'Watch Time', value: `${stats.totalWatchTime}h`, icon: Clock, color: '#00ff88', trend: '+15%' },
  ];

  if (loading) {
    return (
      <div className="dashboard__loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard__overview">
      <div className="dashboard__stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard__stat-card">
              <div className="dashboard__stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="dashboard__stat-info">
                <h3 className="dashboard__stat-label">{stat.label}</h3>
                <p className="dashboard__stat-value">{stat.value}</p>
                <div className="dashboard__stat-trend">
                  <TrendingUp size={14} />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard__section-row">
        <div className="dashboard__recent-activity">
          <h2 className="dashboard__section-title">
            <Activity size={20} />
            Recent Activity
          </h2>
          <div className="dashboard__activity-list">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="dashboard__activity-item">
                  <div className="dashboard__activity-icon">
                    <Icon size={18} />
                  </div>
                  <div className="dashboard__activity-content">
                    <p className="dashboard__activity-title">{activity.title}</p>
                    <span className="dashboard__activity-time">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard__quick-stats">
          <h2 className="dashboard__section-title">
            <Film size={20} />
            Quick Stats
          </h2>
          <div className="dashboard__quick-stats-content">
            <div className="dashboard__progress-item">
              <div className="dashboard__progress-header">
                <span>Videos Watched</span>
                <span className="dashboard__progress-value">24/100</span>
              </div>
              <div className="dashboard__progress-bar">
                <div className="dashboard__progress-fill" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div className="dashboard__progress-item">
              <div className="dashboard__progress-header">
                <span>Content Explored</span>
                <span className="dashboard__progress-value">68%</span>
              </div>
              <div className="dashboard__progress-bar">
                <div className="dashboard__progress-fill" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div className="dashboard__progress-item">
              <div className="dashboard__progress-header">
                <span>Engagement</span>
                <span className="dashboard__progress-value">82%</span>
              </div>
              <div className="dashboard__progress-bar">
                <div className="dashboard__progress-fill" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
