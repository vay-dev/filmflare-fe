import { useState } from 'react';
import { Download, Play, Trash2, CheckCircle } from 'lucide-react';
import './styles/downloads.scss';

interface DownloadedVideo {
  id: number;
  title: string;
  thumbnail: string;
  size: string;
  downloadedAt: string;
  progress: number;
}

const Downloads = () => {
  // Mock data - in production this would come from local storage or IndexedDB
  const [downloads, setDownloads] = useState<DownloadedVideo[]>([
    {
      id: 1,
      title: 'Sample Video',
      thumbnail: 'https://via.placeholder.com/200x120',
      size: '450 MB',
      downloadedAt: new Date().toISOString(),
      progress: 100,
    },
  ]);

  const handleDelete = (id: number) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="downloads-container">
      <div className="downloads-header">
        <div className="downloads-header-content">
          <Download className="downloads-icon" size={32} />
          <div>
            <h2 className="downloads-title">Downloads</h2>
            <p className="downloads-subtitle">
              {downloads.length} {downloads.length === 1 ? 'video' : 'videos'}
            </p>
          </div>
        </div>
      </div>

      <div className="downloads-content">
        {downloads.length === 0 ? (
          <div className="empty-downloads">
            <Download className="empty-icon" size={60} />
            <h3>No downloads yet</h3>
            <p>Downloaded videos will appear here</p>
          </div>
        ) : (
          <div className="downloads-list">
            {downloads.map((download) => (
              <div key={download.id} className="download-item">
                <div className="download-thumbnail">
                  <img src={download.thumbnail} alt={download.title} />
                  {download.progress === 100 && (
                    <div className="download-complete">
                      <CheckCircle size={24} />
                    </div>
                  )}
                </div>

                <div className="download-info">
                  <h4 className="download-title">{download.title}</h4>
                  <div className="download-meta">
                    <span className="download-size">{download.size}</span>
                    <span className="download-separator">•</span>
                    <span className="download-date">
                      {formatDate(download.downloadedAt)}
                    </span>
                  </div>

                  {download.progress < 100 && (
                    <div className="download-progress">
                      <div
                        className="download-progress-bar"
                        style={{ width: `${download.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="download-actions">
                  <button className="action-btn action-btn--play">
                    <Play size={18} />
                    <span>Play</span>
                  </button>
                  <button
                    onClick={() => handleDelete(download.id)}
                    className="action-btn action-btn--delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
