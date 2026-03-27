import { useState } from 'react';
import { Bell, Lock, Palette, Globe, Download, Eye } from 'lucide-react';
import Button from '../shared/Button';

const DashboardSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      newContent: true,
      favorites: true,
    },
    privacy: {
      profileVisibility: 'public',
      showActivity: true,
      allowDownloads: true,
    },
    preferences: {
      autoPlay: true,
      quality: 'auto',
      language: 'en',
      theme: 'dark',
    },
  });

  const handleToggle = (section: 'notifications' | 'privacy' | 'preferences', key: string) => {
    setSettings(prev => {
      const sectionData = prev[section] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: !sectionData[key],
        },
      };
    });
  };

  const handleSave = () => {
    // Handle save settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="dashboard__settings">
      <div className="dashboard__settings-section">
        <div className="dashboard__settings-header">
          <Bell size={20} />
          <h3>Notifications</h3>
        </div>
        <div className="dashboard__settings-group">
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Email Notifications</label>
              <p>Receive updates via email</p>
            </div>
            <label className="dashboard__toggle">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
              <span className="dashboard__toggle-slider"></span>
            </label>
          </div>
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Push Notifications</label>
              <p>Get browser notifications</p>
            </div>
            <label className="dashboard__toggle">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
              />
              <span className="dashboard__toggle-slider"></span>
            </label>
          </div>
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>New Content</label>
              <p>Notify when new content is available</p>
            </div>
            <label className="dashboard__toggle">
              <input
                type="checkbox"
                checked={settings.notifications.newContent}
                onChange={() => handleToggle('notifications', 'newContent')}
              />
              <span className="dashboard__toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard__settings-section">
        <div className="dashboard__settings-header">
          <Lock size={20} />
          <h3>Privacy</h3>
        </div>
        <div className="dashboard__settings-group">
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Profile Visibility</label>
              <p>Control who can see your profile</p>
            </div>
            <select
              className="dashboard__select"
              value={settings.privacy.profileVisibility}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, profileVisibility: e.target.value }
              }))}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Show Activity</label>
              <p>Display your activity to others</p>
            </div>
            <label className="dashboard__toggle">
              <input
                type="checkbox"
                checked={settings.privacy.showActivity}
                onChange={() => handleToggle('privacy', 'showActivity')}
              />
              <span className="dashboard__toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard__settings-section">
        <div className="dashboard__settings-header">
          <Palette size={20} />
          <h3>Preferences</h3>
        </div>
        <div className="dashboard__settings-group">
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Auto Play</label>
              <p>Automatically play next video</p>
            </div>
            <label className="dashboard__toggle">
              <input
                type="checkbox"
                checked={settings.preferences.autoPlay}
                onChange={() => handleToggle('preferences', 'autoPlay')}
              />
              <span className="dashboard__toggle-slider"></span>
            </label>
          </div>
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Video Quality</label>
              <p>Default playback quality</p>
            </div>
            <select
              className="dashboard__select"
              value={settings.preferences.quality}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, quality: e.target.value }
              }))}
            >
              <option value="auto">Auto</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
          </div>
          <div className="dashboard__setting-item">
            <div className="dashboard__setting-info">
              <label>Language</label>
              <p>Preferred language</p>
            </div>
            <select
              className="dashboard__select"
              value={settings.preferences.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, language: e.target.value }
              }))}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard__settings-actions">
        <Button text="Save Changes" onClick={handleSave} variant="primary" showArrows={false} />
        <Button text="Reset to Default" onClick={() => {}} variant="secondary" showArrows={false} />
      </div>
    </div>
  );
};

export default DashboardSettings;
