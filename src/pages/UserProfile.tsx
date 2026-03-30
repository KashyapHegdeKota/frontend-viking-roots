import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { SiteHeader } from '../components/site-header';
import '../styles/UserProfile.css';

interface Profile {
  id: number;
  username: string;
  full_name: string;
  profile_picture_url: string | null;
  bio: string;
  location: string;
  website: string;
  created_at: string;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const url = username ? `${API_BASE_URL}/form/profile/${username}/` : `${API_BASE_URL}/form/profile/`;
        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load profile');
          return;
        }
        setProfile(data.profile);
      } catch {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [username]);

  return (
    <div className="profile-page">
      <SiteHeader />
      <main className="profile-wrap">
        {loading ? (
          <p>Loading profile...</p>
        ) : error || !profile ? (
          <div className="error-container">
            <h2>Profile not found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Go Home</button>
          </div>
        ) : (
          <section className="profile-card">
            <div className="profile-head">
              <div className="profile-avatar">{profile.username[0].toUpperCase()}</div>
              <div>
                <h1>{profile.full_name || profile.username}</h1>
                <p>@{profile.username}</p>
              </div>
            </div>

            {profile.bio ? <p className="bio">{profile.bio}</p> : null}

            <div className="profile-meta">
              {profile.location ? <p>Location: {profile.location}</p> : null}
              {profile.website ? <p>Website: {profile.website}</p> : null}
              <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>

            <div className="profile-actions">
              <button onClick={() => navigate('/feed')}>Community Feed</button>
              <button onClick={() => navigate('/groups')}>Groups</button>
              <button onClick={() => navigate('/questionnaire')}>Questionnaire</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
