import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import '../styles/SocialFeed.css';

interface TaggedUser {
  id: number;
  username: string;
  full_name?: string;
  profile_picture_url: string | null;
}

interface PostAuthor {
  id: number;
  username: string;
  profile_picture_url: string | null;
}

interface CommentData {
  id: number;
  author: PostAuthor;
  content: string;
  created_at: string;
}

interface PostData {
  id: number;
  author: PostAuthor;
  content: string;
  image_url: string | null;
  tagged_users: TaggedUser[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  group: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

const SocialFeed: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create post state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  // Tagging state
  const [tagSearch, setTagSearch] = useState('');
  const [tagResults, setTagResults] = useState<TaggedUser[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaggedUser[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Comment state
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [postComments, setPostComments] = useState<Record<number, CommentData[]>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POSTS, {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || 'Failed to load posts');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Search users for tagging
  useEffect(() => {
    if (tagSearch.length < 1) {
      setTagResults([]);
      setShowTagDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(tagSearch)}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        if (response.ok) {
          // Filter out already tagged users
          const filtered = (data.users || []).filter(
            (u: TaggedUser) => !selectedTags.find((t) => t.id === u.id)
          );
          setTagResults(filtered);
          setShowTagDropdown(filtered.length > 0);
        }
      } catch {
        // ignore
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tagSearch, selectedTags]);

  const handleTagSelect = (user: TaggedUser) => {
    setSelectedTags((prev) => [...prev, user]);
    setTagSearch('');
    setShowTagDropdown(false);
    tagInputRef.current?.focus();
  };

  const handleRemoveTag = (userId: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== userId));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (newPostImage) {
        formData.append('image', newPostImage);
      }
      if (selectedTags.length > 0) {
        formData.append(
          'tagged_user_ids',
          JSON.stringify(selectedTags.map((t) => t.id))
        );
      }

      const response = await fetch(API_ENDPOINTS.CREATE_POST, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setPosts((prev) => [data.post, ...prev]);
        setNewPostContent('');
        setNewPostImage(null);
        setImagePreview(null);
        setSelectedTags([]);
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setPosting(false);
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
        setPosts((prev) =>
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

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/posts/${postId}/delete/`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch {
      // ignore
    }
  };

  const toggleComments = async (postId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Fetch comments if not already loaded
      if (!postComments[postId]) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/community/posts/${postId}/`,
            { credentials: 'include' }
          );
          const data = await response.json();
          if (response.ok) {
            setPostComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
          }
        } catch {
          // ignore
        }
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = async (postId: number) => {
    const content = commentTexts[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/community/posts/${postId}/comments/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
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
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Render content with @mentions highlighted
  const renderContent = (content: string, taggedUsers: TaggedUser[]) => {
    if (taggedUsers.length === 0) return <p className="post-text">{content}</p>;

    const taggedNames = taggedUsers.map((u) => u.username);
    // Build a simple regex to find @username patterns
    const pattern = new RegExp(`@(${taggedNames.join('|')})`, 'g');
    const parts = content.split(pattern);

    return (
      <p className="post-text">
        {parts.map((part, i) =>
          taggedNames.includes(part) ? (
            <span
              key={i}
              className="mention-tag"
              onClick={() => navigate(`/profile/${part}`)}
            >
              @{part}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </p>
    );
  };

  return (
    <div className="social-feed-container">
      {/* Create Post */}
      <div className="create-post-card">
        <form onSubmit={handleCreatePost}>
          <div className="create-post-header">
            <div className="create-post-avatar">
              <div className="avatar-placeholder-sm">U</div>
            </div>
            <textarea
              className="post-input"
              placeholder="What's on your mind? Use @username to tag people..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={2}
              maxLength={2000}
            />
          </div>

          {/* Tag Users */}
          <div className="tag-section">
            <div className="tag-input-wrapper">
              {selectedTags.map((tag) => (
                <span key={tag.id} className="tag-chip">
                  {tag.full_name || tag.username}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                className="tag-search-input"
                placeholder="+ Tag people..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                onFocus={() => tagSearch.length > 0 && setShowTagDropdown(true)}
                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              />
            </div>

            {showTagDropdown && tagResults.length > 0 && (
              <div className="tag-dropdown">
                {tagResults.map((user) => (
                  <div
                    key={user.id}
                    className="tag-option"
                    onMouseDown={() => handleTagSelect(user)}
                  >
                    <div className="tag-option-avatar">
                      {user.profile_picture_url ? (
                        <img src={user.profile_picture_url} alt={user.username} />
                      ) : (
                        <div className="avatar-placeholder-sm">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="tag-option-info">
                      <span className="tag-option-name">
                        {user.full_name || user.username}
                      </span>
                      <span className="tag-option-username">@{user.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => {
                  setNewPostImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="post-actions-bar">
            <div className="post-actions-left">
              <button
                type="button"
                className="attach-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Photo
              </button>
              <button type="button" className="attach-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                Feeling
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <button
              type="submit"
              className="post-submit-btn"
              disabled={posting || (!newPostContent.trim() && !newPostImage)}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Loading feed...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchPosts}>Retry</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state-feed">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <h3>No posts yet</h3>
          <p>Be the first to share something with the community!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              {/* Post Header */}
              <div className="post-header">
                <div className="post-author" onClick={() => navigate(`/profile/${post.author.username}`)}>
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
                    <div className="author-name-row">
                      <span className="author-name">{post.author.username}</span>
                      {post.group && (
                        <>
                          <span className="post-dot"> · </span>
                          <span
                            className="post-circle-name"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/groups/${post.group!.id}`);
                            }}
                          >
                            {post.group.name}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="post-time">{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <button
                  className="post-more-btn"
                  onClick={() => handleDeletePost(post.id)}
                  title="Options"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </button>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="post-image-container">
                  <img src={post.image_url} alt="Post" className="post-image" />
                </div>
              )}

              {/* Post Actions - KinSnap style */}
              <div className="post-footer">
                <div className="post-footer-left">
                  <button
                    className={`action-btn like-btn ${post.liked_by_me ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill={post.liked_by_me ? '#e11d48' : 'none'} stroke={post.liked_by_me ? '#e11d48' : 'currentColor'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{post.like_count}</span>
                  </button>
                  <button
                    className="action-btn comment-btn"
                    onClick={() => toggleComments(post.id)}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>{post.comment_count}</span>
                  </button>
                  <button className="action-btn share-btn">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
                <div className="post-footer-right">
                  <button className="action-btn save-btn">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Tagged Users - Chip style like mockup */}
              {post.tagged_users.length > 0 && (
                <div className="tagged-chips-row">
                  <span className="tagged-label">Tagged:</span>
                  {post.tagged_users.map((u) => (
                    <span
                      key={u.id}
                      className="tagged-chip"
                      onClick={() => navigate(`/profile/${u.username}`)}
                    >
                      {u.username}
                    </span>
                  ))}
                  <span className="tagged-chip add-tag-chip">+ Tag</span>
                </div>
              )}

              {/* Post Content */}
              <div className="post-body">
                {renderContent(post.content, post.tagged_users)}
              </div>

              {/* Comment Input - Always visible like mockup */}
              <div className="comment-input-row">
                <div className="comment-avatar-sm">
                  <div className="avatar-placeholder-xs">U</div>
                </div>
                <div className="comment-input-wrapper">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ''}
                    onChange={(e) =>
                      setCommentTexts((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    className="comment-input"
                  />
                  <div className="comment-input-actions">
                    <button type="button" className="comment-icon-btn" title="Emoji">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </button>
                    <button type="button" className="comment-icon-btn" title="Photo">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Comments */}
              {expandedComments.has(post.id) && (
                <div className="comments-section">
                  {(postComments[post.id] || []).map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-author">
                        {comment.author.profile_picture_url ? (
                          <img
                            src={comment.author.profile_picture_url}
                            alt={comment.author.username}
                            className="comment-avatar"
                          />
                        ) : (
                          <div className="avatar-placeholder-xs">
                            {comment.author.username[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="comment-name">
                            {comment.author.username}
                          </span>
                          <span className="comment-time">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
