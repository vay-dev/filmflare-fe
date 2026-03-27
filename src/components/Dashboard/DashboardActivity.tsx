import { useState, useEffect } from 'react';
import { Eye, Heart, Download, Clock } from 'lucide-react';

const DashboardActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'watched' | 'favorites' | 'downloads'>('all');

  useEffect(() => {
    // Mock activity data
    const mockActivities = [
      {
        id: 1,
        type: 'watched',
        title: 'The Amazing Adventure',
        thumbnail: 'https://via.placeholder.com/100x60',
        time: '2 hours ago',
        duration: '2h 15m',
        icon: Eye,
      },
      {
        id: 2,
        type: 'favorite',
        title: 'Epic Journey',
        thumbnail: 'https://via.placeholder.com/100x60',
        time: '5 hours ago',
        icon: Heart,
      },
      {
        id: 3,
        type: 'download',
        title: 'Mystery Thriller',
        thumbnail: 'https://via.placeholder.com/100x60',
        time: '1 day ago',
        size: '1.2GB',
        icon: Download,
      },
      {
        id: 4,
        type: 'watched',
        title: 'Comedy Special',
        thumbnail: 'https://via.placeholder.com/100x60',
        time: '2 days ago',
        duration: '1h 30m',
        icon: Eye,
      },
      {
        id: 5,
        type: 'favorite',
        title: 'Documentary Series',
        thumbnail: 'https://via.placeholder.com/100x60',
        time: '3 days ago',
        icon: Heart,
      },
    ];

    setActivities(mockActivities);
  }, []);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter.replace('favorites', 'favorite'));

  const getActivityBadge = (type: string) => {
    const badges = {
      watched: { text: 'Watched', color: '#4a9eff' },
      favorite: { text: 'Favorited', color: '#e94560' },
      download: { text: 'Downloaded', color: '#00d9ff' },
    };
    return badges[type as keyof typeof badges] || badges.watched;
  };

  return (
    <div className="dashboard__activity">
      <div className="dashboard__activity-filters">
        <button
          className={`dashboard__filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Activity
        </button>
        <button
          className={`dashboard__filter-btn ${filter === 'watched' ? 'active' : ''}`}
          onClick={() => setFilter('watched')}
        >
          <Eye size={16} />
          Watched
        </button>
        <button
          className={`dashboard__filter-btn ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          <Heart size={16} />
          Favorites
        </button>
        <button
          className={`dashboard__filter-btn ${filter === 'downloads' ? 'active' : ''}`}
          onClick={() => setFilter('downloads')}
        >
          <Download size={16} />
          Downloads
        </button>
      </div>

      <div className="dashboard__activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="dashboard__empty-state">
            <Clock size={48} />
            <p>No activity found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const Icon = activity.icon;
            const badge = getActivityBadge(activity.type);

            return (
              <div key={activity.id} className="dashboard__timeline-item">
                <div className="dashboard__timeline-marker">
                  <Icon size={18} />
                </div>
                <div className="dashboard__timeline-content">
                  <div className="dashboard__timeline-card">
                    <img
                      src={activity.thumbnail}
                      alt={activity.title}
                      className="dashboard__timeline-thumbnail"
                    />
                    <div className="dashboard__timeline-info">
                      <div className="dashboard__timeline-header">
                        <h4>{activity.title}</h4>
                        <span
                          className="dashboard__timeline-badge"
                          style={{ backgroundColor: badge.color }}
                        >
                          {badge.text}
                        </span>
                      </div>
                      <div className="dashboard__timeline-meta">
                        <span className="dashboard__timeline-time">
                          <Clock size={14} />
                          {activity.time}
                        </span>
                        {activity.duration && (
                          <span className="dashboard__timeline-duration">
                            Duration: {activity.duration}
                          </span>
                        )}
                        {activity.size && (
                          <span className="dashboard__timeline-size">
                            Size: {activity.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardActivity;
