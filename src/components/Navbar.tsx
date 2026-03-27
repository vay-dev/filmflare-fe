import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Upload, Heart, Home, LayoutDashboard, ChevronDown, Settings } from "lucide-react";
import { useState } from "react";
import Button from "./shared/Button";
import "./styles/navbar.scss";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">FilmFlare</span>
        </Link>

        <div className="navbar__menu">
          <Link to="/" className="navbar__link">
            <Home size={18} />
            <span>Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="navbar__link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/favorites" className="navbar__link">
                <Heart size={18} />
                <span>Favorites</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/upload" className="navbar__link navbar__link--admin">
              <Upload size={18} />
              <span>Upload Video</span>
            </Link>
          )}
        </div>

        <div className="navbar__user">
          {isAuthenticated ? (
            <div className="navbar__user-section">
              <div
                className="navbar__profile-dropdown"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="navbar__profile">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      className="navbar__avatar"
                    />
                  ) : (
                    <div className="navbar__avatar navbar__avatar--default">
                      <User size={20} />
                    </div>
                  )}
                  <div className="navbar__user-info">
                    <span className="navbar__username">{user?.username}</span>
                    {isAdmin && <span className="navbar__badge">Admin</span>}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`navbar__dropdown-icon ${showUserMenu ? 'open' : ''}`}
                  />
                </div>
              </div>

              {showUserMenu && (
                <div className="navbar__dropdown-menu">
                  <Link
                    to="/dashboard"
                    className="navbar__dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/favorites"
                    className="navbar__dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Heart size={18} />
                    <span>My Favorites</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="navbar__dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/upload"
                      className="navbar__dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Upload size={18} />
                      <span>Upload Video</span>
                    </Link>
                  )}
                  <div className="navbar__dropdown-divider"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-links">
              <Button
                text="L O G I N"
                onClick={() => navigate("/login")}
                variant="secondary"
                showArrows={true}
              />
              <Button
                text="S I G N U P"
                onClick={() => navigate("/register")}
                variant="primary"
                showArrows={false}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
