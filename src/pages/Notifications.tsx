import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, Check, X, Mail, ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import Header from '../components/Header';
import './components/Login.css';

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

const Notifications: React.FC = () => {
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingInvite, setProcessingInvite] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PENDING_INVITES, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInvites(data.invites || []);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Failed to fetch notifications. Please try again.');
      console.error('Error fetching invites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (groupId: number) => {
    setProcessingInvite(groupId);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.ACCEPT_INVITE(groupId), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove accepted invite from list
        setInvites(invites.filter(invite => invite.group.id !== groupId));
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success mx-auto mt-3';
        successMsg.style.maxWidth = '800px';
        successMsg.textContent = 'Successfully joined the group!';
        document.querySelector('.notifications-container')?.prepend(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
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
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.REJECT_INVITE(groupId), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove rejected invite from list
        setInvites(invites.filter(invite => invite.group.id !== groupId));
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="login-section d-flex align-items-center justify-content-center min-vh-100">
        <Header />
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="login-section min-vh-100 p-4 notifications-container">
        <div className="login-box mx-auto p-5" style={{ maxWidth: '900px', width: '100%' }}>
          
          {/* Header Section */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-link text-dark p-0 me-3"
              style={{ textDecoration: 'none' }}
            >
              <ArrowLeft size={24} />
            </button>
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              <Bell size={28} className="text-primary" />
              <h2 className="fw-bold m-0">Notifications</h2>
              {invites.length > 0 && (
                <span 
                  className="badge bg-primary rounded-pill"
                  style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                >
                  {invites.length}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger text-center mb-4">
              {error}
            </div>
          )}

          {/* Notifications Content */}
          {invites.length === 0 ? (
            <div className="text-center py-5 bg-light rounded border">
              <Bell size={64} className="text-muted mb-3" />
              <h3 className="h4 mb-2">No notifications</h3>
              <p className="text-muted mb-0">You're all caught up! New group invites will appear here.</p>
            </div>
          ) : (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Mail size={20} className="text-primary" />
                <h5 className="fw-bold m-0">Group Invitations</h5>
              </div>

              <div className="d-flex flex-column gap-3">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="border rounded p-3 bg-white"
                    style={{
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
                  >
                    <div className="d-flex gap-3">
                      {/* Group Image */}
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {invite.group.image_url ? (
                          <img
                            src={invite.group.image_url}
                            alt={invite.group.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Users size={32} className="text-secondary" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{invite.group.name}</h6>
                            <p className="text-muted small mb-1">
                              <strong>{invite.invited_by}</strong> invited you to join this group
                            </p>
                            <p className="text-muted small mb-0">
                              <Users size={14} className="me-1" />
                              {invite.group.member_count} members · {formatDate(invite.created_at)}
                            </p>
                          </div>
                        </div>

                        {invite.group.description && (
                          <p className="text-muted small mb-3" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {invite.group.description}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleAcceptInvite(invite.group.id)}
                            disabled={processingInvite === invite.group.id}
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                            style={{ minWidth: '100px' }}
                          >
                            <Check size={16} />
                            {processingInvite === invite.group.id ? 'Accepting...' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleRejectInvite(invite.group.id)}
                            disabled={processingInvite === invite.group.id}
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                            style={{ minWidth: '100px' }}
                          >
                            <X size={16} />
                            {processingInvite === invite.group.id ? 'Rejecting...' : 'Reject'}
                          </button>
                          <button
                            onClick={() => navigate(`/group/${invite.group.id}`)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Group
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
