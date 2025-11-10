import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Globe, Calendar, Edit2, User } from 'lucide-react';
import '../styles/UserProfile.css';

interface Profile {
  id: number;
  username: string;
  email?: string;
  full_name: string;
  profile_picture_url: string | null;
  cover_photo_url: string | null;
  bio: string;
  location: string;
  website: string;
  profile_completed: boolean;
  created_at: string;
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const url = username
        ? `${apiBaseUrl}/form/profile/${username}/`
        : `${apiBaseUrl}/form/profile/`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner-large"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <h2>Profile Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Cover Photo */}
      <div className="cover-photo">
        {profile.cover_photo_url ? (
          <img src={profile.cover_photo_url} alt="Cover" />
        ) : (
          <div className="cover-photo-placeholder" />
        )}
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-container">
            {profile.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt={profile.username}
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <User size={64} />
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="name-section">
              <h1 className="profile-name">{profile.full_name}</h1>
              <p className="profile-username">@{profile.username}</p>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button
                onClick={() => navigate('/profile/setup')}
                className="edit-profile-button"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          {/* Bio */}
          {profile.bio && (
            <div className="bio-section">
              <p className="bio-text">{profile.bio}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="metadata-section">
            {profile.location && (
              <div className="metadata-item">
                <MapPin size={18} />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.website && (
              <div className="metadata-item">
                <Globe size={18} />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div className="metadata-item">
              <Calendar size={18} />
              <span>Joined {formatDate(profile.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="profile-sections">
          <div className="section-tabs">
            <button className="tab-button active">Posts</button>
            <button className="tab-button">About</button>
            <button className="tab-button">Photos</button>
          </div>

          <div className="section-content">
            <div className="empty-state">
              <User size={48} />
              <h3>Coming Soon</h3>
              <p>Posts and social features will be available here.</p>
              <button
                onClick={() => navigate('/questionnaire')}
                className="action-button"
              >
                Continue Questionnaire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
