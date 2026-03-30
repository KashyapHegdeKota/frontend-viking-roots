import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { SiteHeader } from '../components/site-header';
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
}

interface GroupData {
  id: number;
  name: string;
  description: string;
  created_by: { id: number; username: string };
  member_count: number;
  membership: { role: string; status: string } | null;
  my_membership?: { role: string; status: string } | null;
}

interface PostData {
  id: number;
  author: { id: number; username: string };
  content: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  created_at: string;
}

export default function GroupsPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [groups, setGroups] = useState<GroupData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupPosts, setGroupPosts] = useState<PostData[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [newPostContent, setNewPostContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<SearchUser[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const url = searchQuery ? `${API_ENDPOINTS.GROUPS}?q=${encodeURIComponent(searchQuery)}` : API_ENDPOINTS.GROUPS;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) setGroups(data.groups || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!groupId) fetchGroups();
  }, [fetchGroups, groupId]);

  const loadGroupDetail = useCallback(async (id: number) => {
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
      if (postsRes.ok) setGroupPosts(postsData.posts || []);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (groupId) loadGroupDetail(parseInt(groupId, 10));
    else setSelectedGroup(null);
  }, [groupId, loadGroupDetail]);

  useEffect(() => {
    if (memberSearch.length < 1) {
      setMemberSearchResults([]);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(memberSearch)}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          const existing = new Set(groupMembers.map((m) => m.id));
          setMemberSearchResults((data.users || []).filter((u: SearchUser) => !existing.has(u.id)));
        }
      } catch {
        // ignore
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [memberSearch, groupMembers]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(API_ENDPOINTS.CREATE_GROUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newGroupName, description: newGroupDescription }),
    });
    if (response.ok) {
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDescription('');
      fetchGroups();
    }
  };

  const joinGroup = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/community/groups/${id}/join/`, { method: 'POST', credentials: 'include' });
    fetchGroups();
    if (selectedGroup?.id === id) loadGroupDetail(id);
  };

  const leaveGroup = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/community/groups/${id}/leave/`, { method: 'POST', credentials: 'include' });
    fetchGroups();
    if (selectedGroup?.id === id) loadGroupDetail(id);
  };

  const addMember = async (userId: number) => {
    if (!selectedGroup) return;
    const response = await fetch(`${API_BASE_URL}/api/community/groups/${selectedGroup.id}/add-member/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id: userId }),
    });
    if (response.ok) {
      loadGroupDetail(selectedGroup.id);
      setMemberSearch('');
      setMemberSearchResults([]);
    }
  };

  const postToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !newPostContent.trim()) return;
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
    }
  };

  if (groupId && selectedGroup) {
    const isMember = selectedGroup.my_membership?.status === 'active';

    return (
      <div className="groups-page">
        <SiteHeader />
        <main className="groups-wrap">
          <button className="back-btn" onClick={() => navigate('/groups')}>Back to groups</button>

          {detailLoading ? (
            <p>Loading group...</p>
          ) : (
            <>
              <section className="group-detail-header">
                <h1>{selectedGroup.name}</h1>
                <p>{selectedGroup.description}</p>
                <p>{selectedGroup.member_count} members</p>
                <div className="group-actions">
                  {isMember ? (
                    <button className="leave-btn" onClick={() => leaveGroup(selectedGroup.id)}>Leave</button>
                  ) : (
                    <button className="join-btn" onClick={() => joinGroup(selectedGroup.id)}>Join</button>
                  )}
                  {isMember && selectedGroup.my_membership?.role === 'admin' ? (
                    <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}>Add members</button>
                  ) : null}
                </div>
              </section>

              <section className="group-content-grid">
                <div>
                  {isMember ? (
                    <form onSubmit={postToGroup} className="create-post-card">
                      <textarea
                        className="post-input"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share with this group..."
                        rows={3}
                      />
                      <button className="post-submit-btn" type="submit">Post</button>
                    </form>
                  ) : null}

                  {groupPosts.map((post) => (
                    <article key={post.id} className="post-card">
                      <h3>@{post.author.username}</h3>
                      <p>{post.content}</p>
                      <div className="post-footer">
                        <span>Likes {post.like_count}</span>
                        <span>Comments {post.comment_count}</span>
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="group-members-sidebar">
                  <h3>Members</h3>
                  {groupMembers.map((member) => (
                    <div key={member.id} className="member-item">@{member.username}</div>
                  ))}
                </aside>
              </section>
            </>
          )}

          {showAddMemberModal ? (
            <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add members</h2>
                <input
                  className="member-search-input"
                  placeholder="Search users"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
                <div className="member-search-results">
                  {memberSearchResults.map((u) => (
                    <div key={u.id} className="member-search-item">
                      <span>@{u.username}</span>
                      <button onClick={() => addMember(u.id)}>Add</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="groups-page">
      <SiteHeader />
      <main className="groups-wrap">
        <section className="groups-header">
          <h1>Community Groups</h1>
          <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>Create Group</button>
        </section>

        <input
          className="group-search-input"
          placeholder="Search groups"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? <p>Loading groups...</p> : null}

        <section className="groups-grid">
          {groups.map((group) => (
            <article key={group.id} className="group-card">
              <button className="group-name" onClick={() => navigate(`/groups/${group.id}`)}>{group.name}</button>
              <p className="group-desc">{group.description || 'No description'}</p>
              <p className="member-count">{group.member_count} members</p>
              {group.membership?.status === 'active' ? (
                <button className="leave-btn-sm" onClick={() => leaveGroup(group.id)}>Leave</button>
              ) : (
                <button className="join-btn-sm" onClick={() => joinGroup(group.id)}>Join</button>
              )}
            </article>
          ))}
        </section>

        {showCreateModal ? (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create Group</h2>
              <form onSubmit={createGroup}>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  required
                />
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Description"
                />
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">Create</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
