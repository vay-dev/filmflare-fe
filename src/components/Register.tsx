import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Upload, UserCircle } from 'lucide-react';
import { toast } from '../services/toastService';
import './styles/auth.scss';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        ...formData,
        profile_image: profileImage || undefined,
      };
      await register(registerData);
      toast.success('Welcome to FilmFlare! Your account has been created successfully.');
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.username?.[0] ||
                       err.response?.data?.email?.[0] ||
                       err.response?.data?.password?.[0] ||
                       'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-container--fullscreen">
      <div className="auth-box auth-box--large">
        <div className="auth-header">
          <UserPlus className="auth-icon" size={48} />
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join our community and start streaming</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          {/* Profile Image Upload */}
          <div className="form-group form-group--full">
            <label className="form-label">
              <UserCircle size={16} />
              Profile Picture
            </label>
            <div className="profile-upload">
              <div className="profile-upload__preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" />
                ) : (
                  <UserCircle size={64} />
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
                  {profileImage ? 'Change Photo' : 'Upload Photo'}
                </label>
                <p className="profile-upload__hint">PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">
              <User size={16} />
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
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
              value={formData.last_name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your last name"
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={16} />
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a unique username"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={16} />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Bio */}
          <div className="form-group form-group--full">
            <label htmlFor="bio" className="form-label">
              <User size={16} />
              Tell us about yourself
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Share a bit about your interests, favorite movies, or anything you'd like others to know..."
              maxLength={200}
              rows={3}
            />
            <span className="form-hint">{formData.bio.length}/200 characters</span>
          </div>

          {/* Password Fields */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="form-label">
              <Lock size={16} />
              Confirm Password *
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="form-input"
              placeholder="Re-enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <div className="form-group form-group--full">
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Creating your account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
