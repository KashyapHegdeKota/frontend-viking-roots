import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Globe, Calendar, Edit2, User, Camera, X, Check } from 'lucide-react';
import { PostCard } from '../components/post-card';
import { API_ENDPOINTS } from '../config/api';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth state
  const loggedInUser = localStorage.getItem('username');

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Derived state
  const isOwner = loggedInUser === profile?.username;

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', location: '', website: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Content State
  const [activeTab, setActiveTab] = useState('Posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000';

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const url = username ? `${API_ENDPOINTS.PROFILE}${username}/` : API_ENDPOINTS.PROFILE;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();

      if (response.ok) {
        const fetchedProfile = data.profile;
        
        // Ensure relative image URLs are prepended with the Django backend URL
        if (fetchedProfile.profile_picture_url && !fetchedProfile.profile_picture_url.startsWith('http')) {
          fetchedProfile.profile_picture_url = `${apiBaseUrl}${fetchedProfile.profile_picture_url}`;
        }
        if (fetchedProfile.cover_photo_url && !fetchedProfile.cover_photo_url.startsWith('http')) {
          fetchedProfile.cover_photo_url = `${apiBaseUrl}${fetchedProfile.cover_photo_url}`;
        }

        setProfile(fetchedProfile);
        setEditForm({
          bio: fetchedProfile.bio || '',
          location: fetchedProfile.location || '',
          website: fetchedProfile.website || ''
        });

        fetchUserPosts(fetchedProfile.username);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (targetUsername: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.POSTS}?username=${targetUsername}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUserPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      alert('Invalid file. Must be JPEG/PNG/WebP and under 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      // Must exactly match the key Django expects in req.FILES.get('profile_picture')
      formData.append('profile_picture', file);

      const response = await fetch(API_ENDPOINTS.PROFILE_UPLOAD_PICTURE, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        const updatedProfile = data.profile;
        
        if (updatedProfile.profile_picture_url && !updatedProfile.profile_picture_url.startsWith('http')) {
          updatedProfile.profile_picture_url = `${apiBaseUrl}${updatedProfile.profile_picture_url}`;
        }
        
        setProfile(updatedProfile); 
      } else {
        console.error("Upload Error:", data);
        alert(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      alert('Network error while uploading.');
    } finally {
      setUploadingImage(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Sent strictly as empty strings to satisfy Django's URLField requirement when null=True is missing
      const sanitizedPayload = {
        bio: editForm.bio || "",
        location: editForm.location || "",
        website: editForm.website || ""
      };

      const response = await fetch(API_ENDPOINTS.PROFILE_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sanitizedPayload)
      });
      
      const data = await response.json();
      if (response.ok) {
        const updatedProfile = data.profile;
        
        if (updatedProfile.profile_picture_url && !updatedProfile.profile_picture_url.startsWith('http')) {
          updatedProfile.profile_picture_url = `${apiBaseUrl}${updatedProfile.profile_picture_url}`;
        }

        setProfile(updatedProfile);
        setIsEditing(false);
      } else {
        console.error("Save Error:", data);
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      alert('Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) return (
    <div className="mx-auto max-w-3xl pt-8 pb-12 px-4">
      <div className="h-40 w-full animate-pulse rounded-t-xl bg-[#171717]" />
      <div className="h-64 w-full animate-pulse rounded-b-xl bg-[#262626]" />
    </div>
  );

  if (error || !profile) return (
    <div className="mx-auto max-w-3xl pt-8 pb-12 px-4 text-center">
      <div className="rounded-xl border border-[#262626] bg-[#171717] p-12">
        <h2 className="text-xl font-bold text-white mb-2">Profile Not Found</h2>
        <p className="text-white/50 mb-6">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="rounded-lg bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-6 py-2 text-sm font-bold text-[#000]">
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="profile-container mx-auto max-w-3xl pt-8 pb-12 px-4">
      <div className="profile-content flex flex-col rounded-xl border border-[#262626] bg-[#171717]">
        
        {/* Cover Photo - Fixed height creates a hard layout boundary to prevent clipping */}
        <div className="h-40 w-full rounded-t-xl bg-[linear-gradient(to_right,#c88a65_0%,#0a0a0a_100%)] opacity-80" />

        {/* Profile Header */}
        <div className="profile-header flex flex-col items-center border-b border-[#262626] px-8 pb-6 pt-8 sm:flex-row sm:items-start sm:gap-6">
          
          {/* Editable Avatar */}
          <div className="profile-picture-container group relative shrink-0">
            {profile.profile_picture_url ? (
              <img 
                src={profile.profile_picture_url} 
                alt={profile.username} 
                className="h-28 w-28 rounded-full border-4 border-[#171717] bg-[#0a0a0a] object-cover" 
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#171717] bg-[#262626] text-white">
                <User size={48} />
              </div>
            )}
            
            {isOwner && (
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {uploadingImage ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  <Camera className="text-white" size={24} />
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </label>
            )}
          </div>

          {/* Header Info & Actions */}
          <div className="profile-info mt-4 flex w-full flex-1 flex-col items-center justify-between gap-4 sm:mt-0 sm:flex-row sm:items-start">
            <div className="name-section text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{profile.full_name || profile.username}</h1>
              <p className="font-semibold text-[#c88a65]">@{profile.username}</p>
            </div>

            {isOwner && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#262626] px-4 py-2 text-white transition-colors hover:bg-[#262626]"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Bio/Metadata Section */}
        <div className="profile-details mt-6 px-8">
          {isEditing ? (
            <div className="edit-form-container flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#171717] p-4">
              <div>
                <label className="mb-1 block text-xs text-white/50">Bio</label>
                <textarea 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})} 
                  maxLength={500} 
                  className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white outline-none focus:border-[#c88a65]" 
                  rows={3} 
                />
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})} 
                    className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white outline-none focus:border-[#c88a65]" 
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Website</label>
                  <input 
                    type="url" 
                    value={editForm.website} 
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})} 
                    className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white outline-none focus:border-[#c88a65]" 
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-white/60 transition-colors hover:text-white"
                >
                  <X size={16}/> Cancel
                </button>
                <button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving} 
                  className="flex items-center gap-2 rounded-lg bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-4 py-2 font-bold text-black hover:bg-[linear-gradient(to_right,#eab2a0,white)] disabled:opacity-50"
                >
                  <Check size={16}/> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {profile.bio && (
                <div className="bio-section mb-4">
                  <p className="bio-text text-sm leading-relaxed text-white/90">{profile.bio}</p>
                </div>
              )}
              
              <div className="metadata-section flex flex-wrap gap-4 text-sm text-white/60">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} /><span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe size={16} />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#c88a65] hover:underline">
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} /><span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabbed Content Sections */}
        <div className="profile-sections mt-8 px-8 pb-12">
          <div className="section-tabs mb-6 flex gap-6 border-b border-[#262626]">
            {['Posts', 'About', 'Photos'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-[#c88a65] text-[#c88a65]' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="section-content">
            {activeTab === 'Posts' && (
              loadingPosts ? (
                <div className="h-32 w-full animate-pulse rounded-xl bg-[#262626]"></div>
              ) : userPosts.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {userPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              ) : (
                <div className="empty-state flex flex-col items-center gap-3 rounded-xl border border-[#262626] bg-[#0a0a0a] p-12 text-center">
                  <div className="rounded-full bg-[#262626] p-4 text-white/30"><User size={32} /></div>
                  <h3 className="font-bold text-white">No posts yet</h3>
                  <p className="text-sm text-white/50">When {profile.username} shares stories or photos, they'll appear here.</p>
                </div>
              )
            )}
            {activeTab === 'About' && <div className="text-white/50">Detailed heritage stats coming soon.</div>}
            {activeTab === 'Photos' && <div className="text-white/50">Media gallery coming soon.</div>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;