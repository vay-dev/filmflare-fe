import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from '../services/toastService';
import { User, Mail, Lock, Upload, UserCircle, Save, KeyRound } from 'lucide-react';
import type { UserUpdateData, ChangePasswordData } from '../interfaces/user.interface';
import './styles/profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.profile_image || '');

  // Password form state
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    old_password: '',
    new_password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: UserUpdateData = {
        ...profileData,
      };

      // Only include profile_image if a new file was selected
      if (profileImage) {
        updateData.profile_image = profileImage;
      }

      await authService.updateProfile(updateData);
      toast.success('Profile updated successfully!');

      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.username?.[0] ||
                       err.response?.data?.email?.[0] ||
                       'Failed to update profile. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirm_password') {
      setConfirmPassword(value);
    } else {
      setPasswordData({
        ...passwordData,
        [name]: value,
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (passwordData.new_password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully! Logging you out...');

      // Logout user after password change
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.old_password?.[0] ||
                       err.response?.data?.new_password?.[0] ||
                       err.response?.data?.detail ||
                       'Failed to change password. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <h1 className="profile-title">Account Settings</h1>
          <p className="profile-subtitle">Manage your profile and security</p>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profile Information
          </button>
          <button
            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <KeyRound size={18} />
            Change Password
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              {/* Profile Image */}
              <div className="form-section">
                <h2 className="form-section-title">Profile Picture</h2>
                <div className="profile-upload">
                  <div className="profile-upload__preview profile-upload__preview--large">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" />
                    ) : (
                      <UserCircle size={80} />
                    )}
                  </div>
                  <div className="profile-upload__input">
                    <input
                      type="file"
                      id="profile_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="profile-upload__file"
                    />
                    <label htmlFor="profile_image" className="profile-upload__label">
                      <Upload size={18} />
                      {profileImage ? 'Change Photo' : 'Upload New Photo'}
                    </label>
                    <p className="profile-upload__hint">PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <h2 className="form-section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="first_name" className="form-label">
                      <User size={16} />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name" className="form-label">
                      <User size={16} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      <User size={16} />
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <Mail size={16} />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group form-group--full">
                    <label htmlFor="bio" className="form-label">
                      <User size={16} />
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      className="form-textarea"
                      placeholder="Tell us about yourself..."
                      maxLength={200}
                      rows={3}
                    />
                    <span className="form-hint">{profileData.bio.length}/200 characters</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-section">
                <h2 className="form-section-title">Change Password</h2>
                <p className="form-section-desc">
                  You'll be logged out after changing your password
                </p>

                <div className="form-grid form-grid--single">
                  <div className="form-group">
                    <label htmlFor="old_password" className="form-label">
                      <Lock size={16} />
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="old_password"
                      name="old_password"
                      value={passwordData.old_password}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new_password" className="form-label">
                      <Lock size={16} />
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password" className="form-label">
                      <Lock size={16} />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Re-enter new password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn--danger"
                  disabled={loading}
                >
                  <KeyRound size={18} />
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
