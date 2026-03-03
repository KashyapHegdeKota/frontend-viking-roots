import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Plus, Lock, Globe, Check, X, Mail } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import './components/Login.css';
import Header from '../components/Header';

interface GroupInvite {
  id: number;
  group: {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    member_count: number;
    is_public: boolean;
  };
  invited_by: string;
  created_at: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  creator: string;
  is_public: boolean;
  image_url: string | null;
  member_count: number;
  created_at: string;
  is_member: boolean;
  user_role: string | null;
}

const GroupList: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileUsername, setProfileUsername] = useState('');
  const [processingInvite, setProcessingInvite] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      fetchGroups();
      fetchInvites();
    }
  }, [username]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LIST_USER_GROUPS(username!), {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups);
        setProfileUsername(data.profile_username);
        setIsOwnProfile(data.is_own_profile);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch groups');
      }
    } catch (err) {
      setError('Failed to fetch groups. Please try again.');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`);
  };

  const fetchInvites = async () => {
    if (!isOwnProfile) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.PENDING_INVITES, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInvites(data.invites || []);
      }
    } catch (err) {
      console.error('Error fetching invites:', err);
    }
  };

  const handleAcceptInvite = async (groupId: number) => {
    setProcessingInvite(groupId);
    try {
      const response = await fetch(API_ENDPOINTS.ACCEPT_INVITE(groupId), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Refresh both groups and invites
        await fetchGroups();
        await fetchInvites();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to accept invite');
      }
    } catch (err) {
      setError('Failed to accept invite. Please try again.');
      console.error('Error accepting invite:', err);
    } finally {
      setProcessingInvite(null);
    }
  };

  const handleRejectInvite = async (groupId: number) => {
    setProcessingInvite(groupId);
    try {
      const response = await fetch(API_ENDPOINTS.REJECT_INVITE(groupId), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Refresh invites list
        await fetchInvites();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to reject invite');
      }
    } catch (err) {
      setError('Failed to reject invite. Please try again.');
      console.error('Error rejecting invite:', err);
    } finally {
      setProcessingInvite(null);
    }
  };

  const handleCreateGroup = () => {
    navigate('/groups/create');
  };

  if (loading) {
    return (
      <div className="login-section d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-section min-vh-100 p-4">
  
      <div className="login-box mx-auto p-5" style={{ display: 'flex', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'column', maxWidth: '1000px', width: '100%' }}>
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="fw-bold m-0">{profileUsername}'s Groups</h2>
          {isOwnProfile && (
            <button 
              onClick={handleCreateGroup}
              className="btn btn-custom d-flex align-items-center gap-2"
              style={{ padding: '10px 20px' }}
            >
              <Plus size={20} />
              Create Group
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger text-center mb-4">
            {error}
          </div>
        )}

        {/* Pending Invites Section */}
        {isOwnProfile && invites.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Mail size={24} className="text-primary" />
              <h4 className="fw-bold m-0">Pending Invites ({invites.length})</h4>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '2px solid #0d6efd',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(13,110,253,0.15)'
                  }}
                >
                  {/* Invite Badge */}
                  <div style={{
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Group Invitation
                  </div>

                  {/* Image Container */}
                  <div style={{ 
                    height: '140px', 
                    overflow: 'hidden', 
                    backgroundColor: '#f8f9fa', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderBottom: '1px solid #eee'
                  }}>
                    {invite.group.image_url ? (
                      <img
                        src={invite.group.image_url}
                        alt={invite.group.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Users size={48} className="text-secondary" style={{ opacity: 0.5 }} />
                    )}
                  </div>

                  {/* Content Body */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h5 className="fw-bold mb-2 text-dark">{invite.group.name}</h5>
                    
                    <p className="text-muted small mb-2" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.5'
                    }}>
                      {invite.group.description || 'No description available'}
                    </p>

                    <div className="d-flex align-items-center gap-1 text-muted small mb-3">
                      <Users size={14} />
                      <span>{invite.group.member_count} members</span>
                      {invite.group.is_public ? (
                        <><Globe size={14} className="ms-2" /> <span>Public</span></>
                      ) : (
                        <><Lock size={14} className="ms-2" /> <span>Private</span></>
                      )}
                    </div>

                    <p className="text-muted small mb-3">
                      <strong>Invited by:</strong> {invite.invited_by}
                    </p>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        onClick={() => handleAcceptInvite(invite.group.id)}
                        disabled={processingInvite === invite.group.id}
                        className="btn btn-success flex-fill d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: '0.9rem', padding: '8px' }}
                      >
                        <Check size={16} />
                        {processingInvite === invite.group.id ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectInvite(invite.group.id)}
                        disabled={processingInvite === invite.group.id}
                        className="btn btn-outline-danger flex-fill d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: '0.9rem', padding: '8px' }}
                      >
                        <X size={16} />
                        {processingInvite === invite.group.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Section */}
        {isOwnProfile && groups.length > 0 && (
          <h4 className="fw-bold mb-3">My Groups</h4>
        )}

        {groups.length === 0 ? (
          <div className="text-center py-5 bg-light rounded border">
            <Users size={64} className="text-muted mb-3" />
            <h3 className="h4 mb-2">No groups yet</h3>
            {isOwnProfile ? (
              <>
                <p className="text-muted mb-4">Create a group to connect with people who share your interests!</p>
                <button 
                  onClick={handleCreateGroup}
                  className="btn btn-outline-primary"
                >
                  Create Your First Group
                </button>
              </>
            ) : (
              <p className="text-muted">{profileUsername} hasn't joined any groups yet.</p>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#ccc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                {/* Image Container */}
                <div style={{ 
                  height: '180px', 
                  overflow: 'hidden', 
                  backgroundColor: '#f8f9fa', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderBottom: '1px solid #eee'
                }}>
                  {group.image_url ? (
                    <img
                      src={group.image_url}
                      alt={group.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Users size={48} className="text-secondary" style={{ opacity: 0.5 }} />
                  )}
                </div>

                {/* Content Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold m-0 text-dark" style={{ fontSize: '1.1rem' }}>{group.name}</h5>
                    {group.is_public ? (
                      <span title="Public">
                        <Globe size={16} className="text-muted" />
                      </span>
                    ) : (
                      <span title="Private">
                        <Lock size={16} className="text-muted" />
                      </span>
                    )}
                  </div>

                  <p className="text-muted small flex-grow-1 mb-3" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {group.description || 'No description available'}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                    <div className="d-flex align-items-center gap-1 text-muted small">
                      <Users size={14} />
                      <span>{group.member_count} members</span>
                    </div>

                    {group.is_member && (
                      <span 
                        className="badge rounded-pill"
                        style={{ 
                          backgroundColor: group.user_role === 'admin' ? '#0d6efd' : '#6c757d',
                          fontWeight: '500',
                          padding: '6px 12px'
                        }}
                      >
                        {group.user_role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
