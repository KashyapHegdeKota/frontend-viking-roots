import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import '../styles/Groups.css';

interface SearchUser {
  id: number;
  username: string;
  full_name: string;
  profile_picture_url: string | null;
}

interface GroupMember {
  id: number;
  username: string;
  role: string;
  profile_picture_url: string | null;
  joined_at: string;
}

interface GroupData {
  id: number;
  name: string;
  description: string;
  created_by: { id: number; username: string };
  member_count: number;
  membership: { role: string; status: string } | null;
  my_membership?: { role: string; status: string } | null;
  created_at: string;
}

interface PostData {
  id: number;
  author: { id: number; username: string; profile_picture_url: string | null };
  content: string;
  image_url: string | null;
  tagged_users: { id: number; username: string }[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  created_at: string;
}

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  // List view state
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Create group state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Detail view state
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupPosts, setGroupPosts] = useState<PostData[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Group post creation
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Add member state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<SearchUser[]>([]);
  const [addingMember, setAddingMember] = useState(false);
  const memberSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `${API_ENDPOINTS.GROUPS}?q=${encodeURIComponent(searchQuery)}`
        : API_ENDPOINTS.GROUPS;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        setGroups(data.groups || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!groupId) {
      fetchGroups();
    }
  }, [fetchGroups, groupId]);

  // Load group detail if groupId is in URL
  useEffect(() => {
    if (groupId) {
      loadGroupDetail(parseInt(groupId));
    } else {
      setSelectedGroup(null);
    }
  }, [groupId]);

  const loadGroupDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const [groupRes, postsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/community/groups/${id}/`, { credentials: 'include' }),
        fetch(`${API_ENDPOINTS.POSTS}?group_id=${id}`, { credentials: 'include' }),
      ]);

      const groupData = await groupRes.json();
      const postsData = await postsRes.json();

      if (groupRes.ok) {
        setSelectedGroup(groupData.group);
        setGroupMembers(groupData.members || []);
      }
      if (postsRes.ok) {
        setGroupPosts(postsData.posts || []);
      }
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_GROUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupDescription('');
        fetchGroups();
      } else {
        alert(data.error || 'Failed to create group');
      }
    } catch {
      alert('Network error');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroup = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/groups/${id}/join/`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        fetchGroups();
        if (selectedGroup?.id === id) {
          loadGroupDetail(id);
        }
      } else {
        alert(data.error || 'Failed to join group');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleLeaveGroup = async (id: number) => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/groups/${id}/leave/`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        fetchGroups();
        if (selectedGroup?.id === id) {
          loadGroupDetail(id);
        }
      } else {
        alert(data.error || 'Failed to leave group');
      }
    } catch {
      alert('Network error');
    }
  };

  const handlePostInGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !selectedGroup) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('group_id', selectedGroup.id.toString());

      const response = await fetch(API_ENDPOINTS.CREATE_POST, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setGroupPosts((prev) => [data.post, ...prev]);
        setNewPostContent('');
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch {
      alert('Network error');
    } finally {
      setPosting(false);
    }
  };

  // Search users for adding to group
  useEffect(() => {
    if (memberSearch.length < 1) {
      setMemberSearchResults([]);
      return;
    }
    if (memberSearchTimerRef.current) clearTimeout(memberSearchTimerRef.current);
    memberSearchTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(memberSearch)}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        if (response.ok) {
          const existingIds = new Set(groupMembers.map((m) => m.id));
          setMemberSearchResults(
            (data.users || []).filter((u: SearchUser) => !existingIds.has(u.id))
          );
        }
      } catch {
        // ignore
      }
    }, 300);
    return () => {
      if (memberSearchTimerRef.current) clearTimeout(memberSearchTimerRef.current);
    };
  }, [memberSearch, groupMembers]);

  const handleAddMember = async (userId: number) => {
    if (!selectedGroup) return;
    setAddingMember(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/groups/${selectedGroup.id}/add-member/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        loadGroupDetail(selectedGroup.id);
        setMemberSearch('');
        setMemberSearchResults([]);
        alert(data.message);
      } else {
        alert(data.error || 'Failed to add member');
      }
    } catch {
      alert('Network error');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: number, username: string) => {
    if (!selectedGroup) return;
    if (!confirm(`Remove @${username} from this group?`)) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/groups/${selectedGroup.id}/remove-member/${userId}/`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        loadGroupDetail(selectedGroup.id);
      } else {
        alert(data.error || 'Failed to remove member');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/posts/${postId}/like/`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await response.json();
      if (response.ok) {
        setGroupPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked_by_me: data.liked, like_count: data.like_count }
              : p
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Group Detail View
  if (groupId && selectedGroup) {
    const isMember = selectedGroup.my_membership?.status === 'active';

    return (
      <>
        <div className="groups-container">
          <button className="back-btn" onClick={() => navigate('/groups')}>
            ← Back to Groups
          </button>

          {detailLoading ? (
            <div className="loading-state">
              <div className="spinner-large" />
              <p>Loading group...</p>
            </div>
          ) : (
            <>
              <div className="group-detail-header">
                <h1>{selectedGroup.name}</h1>
                <p className="group-description">{selectedGroup.description}</p>
                <div className="group-meta">
                  <span>{selectedGroup.member_count} members</span>
                  <span>Created by @{selectedGroup.created_by.username}</span>
                </div>
                <div className="group-actions">
                  {isMember && selectedGroup.my_membership?.role === 'admin' && (
                    <button
                      className="add-member-btn"
                      onClick={() => setShowAddMemberModal(true)}
                    >
                      + Add Members
                    </button>
                  )}
                  {isMember ? (
                    <button
                      className="leave-btn"
                      onClick={() => handleLeaveGroup(selectedGroup.id)}
                    >
                      Leave Group
                    </button>
                  ) : (
                    <button
                      className="join-btn"
                      onClick={() => handleJoinGroup(selectedGroup.id)}
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </div>

              <div className="group-content-grid">
                {/* Posts Column */}
                <div className="group-posts-column">
                  {isMember && (
                    <div className="create-post-card">
                      <form onSubmit={handlePostInGroup}>
                        <textarea
                          className="post-input"
                          placeholder="Share with this group..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          rows={3}
                        />
                        <button
                          type="submit"
                          className="post-submit-btn"
                          disabled={posting || !newPostContent.trim()}
                        >
                          {posting ? 'Posting...' : 'Post to Group'}
                        </button>
                      </form>
                    </div>
                  )}

                  {groupPosts.length === 0 ? (
                    <div className="empty-state-feed">
                      <p>No posts in this group yet.</p>
                    </div>
                  ) : (
                    groupPosts.map((post) => (
                      <div key={post.id} className="post-card">
                        <div className="post-header">
                          <div
                            className="post-author"
                            onClick={() =>
                              navigate(`/profile/${post.author.username}`)
                            }
                          >
                            {post.author.profile_picture_url ? (
                              <img
                                src={post.author.profile_picture_url}
                                alt={post.author.username}
                                className="author-avatar"
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {post.author.username[0].toUpperCase()}
                              </div>
                            )}
                            <div className="author-info">
                              <span className="author-name">
                                {post.author.username}
                              </span>
                              <span className="post-time">
                                {formatDate(post.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="post-body">
                          <p className="post-text">{post.content}</p>
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt="Post"
                              className="post-image"
                            />
                          )}
                        </div>
                        <div className="post-footer">
                          <button
                            className={`action-btn like-btn ${post.liked_by_me ? 'liked' : ''}`}
                            onClick={() => handleLike(post.id)}
                          >
                            {post.liked_by_me ? '❤️' : '🤍'} {post.like_count}
                          </button>
                          <button className="action-btn comment-btn">
                            💬 {post.comment_count}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Members Sidebar */}
                <div className="group-members-sidebar">
                  <h3>Members ({groupMembers.length})</h3>
                  <div className="members-list">
                    {groupMembers.map((member) => (
                      <div
                        key={member.id}
                        className="member-item"
                        onClick={() => navigate(`/profile/${member.username}`)}
                      >
                        {member.profile_picture_url ? (
                          <img
                            src={member.profile_picture_url}
                            alt={member.username}
                            className="member-avatar"
                          />
                        ) : (
                          <div className="avatar-placeholder-sm">
                            {member.username[0].toUpperCase()}
                          </div>
                        )}
                        <div className="member-info">
                          <span className="member-name">{member.username}</span>
                          {member.role !== 'member' && (
                            <span className={`role-badge ${member.role}`}>
                              {member.role}
                            </span>
                          )}
                        </div>
                        {selectedGroup.my_membership?.role === 'admin' &&
                          member.role !== 'admin' && (
                            <button
                              className="remove-member-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMember(member.id, member.username);
                              }}
                              title={`Remove @${member.username}`}
                            >
                              ×
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && selectedGroup && (
          <div className="modal-overlay" onClick={() => { setShowAddMemberModal(false); setMemberSearch(''); setMemberSearchResults([]); }}>
            <div className="modal-content add-member-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => { setShowAddMemberModal(false); setMemberSearch(''); setMemberSearchResults([]); }}>×</button>
              <h2>Add Members to {selectedGroup.name}</h2>
              <input
                type="text"
                className="member-search-input"
                placeholder="Search users by username..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                autoFocus
              />
              <div className="member-search-results">
                {memberSearchResults.length === 0 && memberSearch.length >= 2 && !addingMember && (
                  <p className="no-results">No users found</p>
                )}
                {memberSearchResults.map((user) => (
                  <div key={user.id} className="member-search-item">
                    <div className="member-search-info">
                      {user.profile_picture_url ? (
                        <img src={user.profile_picture_url} alt="" className="member-avatar" />
                      ) : (
                        <div className="member-avatar-placeholder">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="member-username">{user.username}</span>
                    </div>
                    <button
                      className="add-btn-sm"
                      onClick={() => handleAddMember(user.id)}
                      disabled={addingMember}
                    >
                      {addingMember ? '...' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Groups List View
  return (
    <>
      <div className="groups-container">
        <div className="groups-header">
          <h1>Community Groups</h1>
        </div>

        <div className="groups-toolbar">
          <input
            type="text"
            className="group-search-input"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="create-group-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Group
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-large" />
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state-feed">
            <h3>No groups found</h3>
            <p>Create a group to start building community!</p>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-card-header">
                  <h3
                    className="group-name"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    {group.name}
                  </h3>
                  <span className="member-count">
                    {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="group-desc">
                  {group.description || 'No description'}
                </p>
                <div className="group-card-footer">
                  <span className="group-creator">
                    by @{group.created_by.username}
                  </span>
                  {group.membership?.status === 'active' ? (
                    <button
                      className="leave-btn-sm"
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="join-btn-sm"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Group</h2>
              <form onSubmit={handleCreateGroup}>
                <div className="form-group">
                  <label>Group Name *</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    maxLength={200}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="What is this group about?"
                    rows={4}
                    maxLength={1000}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={creating || !newGroupName.trim()}
                  >
                    {creating ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupsPage;
