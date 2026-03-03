import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import {
  ArrowLeft,
  Users,
  Send,
  Trash2,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Globe,
  Lock,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import './components/GroupDetail.css'; // We will create this specific file next

// --- Interfaces (Kept exactly as provided) ---
interface Group {
  id: number;
  name: string;
  description: string;
  creator: string;
  is_public: boolean;
  image_url: string | null;
  member_count: number;
  admin_count: number;
  created_at: string;
  is_member: boolean;
  user_role: string | null;
  members: Member[];
}

interface Member {
  id: number;
  username: string;
  role: string;
  joined_at: string;
}

interface Post {
  id: number;
  content: string;
  author: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
}

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const navigate = useNavigate();

  // --- Logic / Effects (Kept exactly as provided) ---
  useEffect(() => {
    fetchCurrentUser();
    if (groupId) {
      fetchGroupDetail();
      fetchGroupPosts();
    }
  }, [groupId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CREATE_GROUP.replace('/groups/create/', '/profile/')}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUsername(data.profile.username);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchGroupDetail = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GROUP_DETAIL(Number(groupId)), {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setGroup(data.group);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch group details');
      }
    } catch (err) {
      setError('Failed to fetch group details. Please try again.');
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GROUP_POSTS(Number(groupId)), {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_POST(Number(groupId)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newPostContent }),
      });
      if (response.ok) {
        setNewPostContent('');
        fetchGroupPosts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_POST(Number(groupId), postId), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) fetchGroupPosts();
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberUsername.trim()) return;
    try {
      const response = await fetch(API_ENDPOINTS.ADD_MEMBER(Number(groupId)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: newMemberUsername }),
      });
      if (response.ok) {
        setNewMemberUsername('');
        setShowAddMember(false);
        setError('');
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success m-3';
        successMsg.textContent = `Invitation sent to ${newMemberUsername}!`;
        document.querySelector('.group-wrapper')?.prepend(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
        fetchGroupDetail();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
    }
  };

  const handleRemoveMember = async (username: string) => {
    if (!confirm(`Remove ${username} from the group?`)) return;
    try {
      const response = await fetch(API_ENDPOINTS.REMOVE_MEMBER(Number(groupId)), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });
      if (response.ok) fetchGroupDetail();
    } catch (err) {
      setError('Failed to remove member.');
    }
  };

  const handleToggleAdmin = async (username: string, currentRole: string) => {
    const makeAdmin = currentRole !== 'admin';
    const action = makeAdmin ? 'promote to admin' : 'demote to member';
    if (!confirm(`${action} for ${username}?`)) return;
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGN_ADMIN(Number(groupId)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, make_admin: makeAdmin }),
      });
      if (response.ok) fetchGroupDetail();
    } catch (err) {
      setError('Failed to update role.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  // --- Render ---

  if (loading) return (
    <div className="group-page-container d-flex align-items-center justify-content-center">
      <div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  if (!group) return (
    <div className="group-page-container d-flex align-items-center justify-content-center">
      <div className="alert alert-danger">Group not found</div>
    </div>
  );

  const isAdmin = group.user_role === 'admin';
  const isMember = group.is_member;

  return (
    <div className="group-page-container"> 
    <Header />
      <div className="group-wrapper">
       
        {/* Navigation Bar */}
        <div className="group-nav">
          <button onClick={() => currentUsername ? navigate(`/groups/${currentUsername}`) : navigate(-1)} className="back-btn">
            <ArrowLeft size={20} /> Back to Groups
          </button>
        </div>

        {error && <div className="alert alert-danger m-3">{error}</div>}

        {/* Header Card */}
        <div className="glass-card header-card">
          <div className="cover-area">
            {group.image_url ? (
              <img src={group.image_url} alt={group.name} className="cover-img" />
            ) : (
              <div className="cover-placeholder" />
            )}
            <div className="group-avatar-large">
              {group.image_url ? (
                <img src={group.image_url} alt="Group" />
              ) : (
                <Users size={40} />
              )}
            </div>
          </div>

          <div className="header-content">
            <div className="header-top">
              <div>
                <h1 className="group-name">{group.name}</h1>
                <div className="group-meta">
                  <span className="meta-pill">
                    {group.is_public ? <Globe size={14} /> : <Lock size={14} />}
                    {group.is_public ? 'Public' : 'Private'}
                  </span>
                  <span className="meta-text">{group.member_count} Members</span>
                  <span className="meta-text">By {group.creator}</span>
                </div>
              </div>
              {isMember && (
                <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-member'}`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              )}
            </div>
            
            {group.description && <p className="group-description">{group.description}</p>}

            {/* Tabs */}
            <div className="group-tabs-row">
              <button
                className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Discussion
              </button>
              <button
                className={`tab-link ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members <span className="tab-count">{group.member_count}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content-area">
          {activeTab === 'posts' && (
            <div className="feed-container">
              {/* Create Post */}
              {isMember && (
                <div className="glass-card create-post-box">
                  <div className="create-post-top">
                    <div className="user-avatar">{currentUsername.charAt(0).toUpperCase()}</div>
                    <form onSubmit={handleCreatePost} className="post-form">
                      <textarea
                        className="post-textarea"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder={`What's on your mind, ${currentUsername}?`}
                        rows={newPostContent ? 3 : 1}
                        maxLength={5000}
                      />
                      {newPostContent && (
                        <div className="post-actions-row">
                          <small className="char-count">{newPostContent.length}/5000</small>
                          <button type="submit" className="btn-post">
                            <Send size={16} /> Post
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* Posts Feed */}
              <div className="posts-list">
                {posts.length === 0 ? (
                  <div className="glass-card empty-state">
                    <p>No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="glass-card post-card">
                      <div className="post-header">
                        <div className="post-author-block">
                          <div className="user-avatar">{post.author.charAt(0).toUpperCase()}</div>
                          <div className="post-meta">
                            <span className="author-name">{post.author}</span>
                            <span className="post-time">
                              <Clock size={12} /> {formatDate(post.created_at)}
                              {post.is_edited && ' (edited)'}
                            </span>
                          </div>
                        </div>
                        {(isAdmin || post.author === group.creator) && (
                          <div className="dropdown">
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="btn-icon-danger"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="post-body">
                        {post.content}
                      </div>
                      
                      {post.image_url && (
                        <div className="post-image-wrapper">
                          <img src={post.image_url} alt="Post attachment" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-container">
              {/* Invite Member */}
              {isAdmin && (
                <div className="glass-card add-member-box">
                  {!showAddMember ? (
                    <button onClick={() => setShowAddMember(true)} className="btn-add-member">
                      <UserPlus size={20} /> Invite Member
                    </button>
                  ) : (
                    <form onSubmit={handleAddMember} className="add-member-form">
                      <input
                        type="text"
                        className="form-input"
                        value={newMemberUsername}
                        onChange={(e) => setNewMemberUsername(e.target.value)}
                        placeholder="Enter username to invite"
                        autoFocus
                      />
                      <div className="add-actions">
                        <button type="submit" className="btn-primary-sm">Send Invite</button>
                        <button type="button" onClick={() => setShowAddMember(false)} className="btn-secondary-sm">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Members List */}
              <div className="glass-card members-list">
                {group.members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="user-avatar small">{member.username.charAt(0).toUpperCase()}</div>
                      <div className="member-details">
                        <div className="member-name-row">
                            <span className="name">{member.username}</span>
                            {member.role === 'admin' && <span className="badge-admin-mini">Admin</span>}
                        </div>
                        <span className="joined-date">Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {isAdmin && member.username !== group.creator && (
                      <div className="member-actions">
                        <button
                          onClick={() => handleToggleAdmin(member.username, member.role)}
                          className="btn-icon"
                          title={member.role === 'admin' ? 'Demote' : 'Promote'}
                        >
                          {member.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.username)}
                          className="btn-icon danger"
                          title="Remove"
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;