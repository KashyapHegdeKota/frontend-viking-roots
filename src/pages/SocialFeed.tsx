import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { SiteHeader } from '../components/site-header';
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
}

export default function SocialFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const [tagSearch, setTagSearch] = useState('');
  const [tagResults, setTagResults] = useState<TaggedUser[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaggedUser[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [postComments, setPostComments] = useState<Record<number, CommentData[]>>({});

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POSTS, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) setPosts(data.posts || []);
      else setError(data.error || 'Failed to load posts');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (tagSearch.length < 1) {
      setTagResults([]);
      setShowTagDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(tagSearch)}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          const filtered = (data.users || []).filter((u: TaggedUser) => !selectedTags.find((t) => t.id === u.id));
          setTagResults(filtered);
          setShowTagDropdown(filtered.length > 0);
        }
      } catch {
        // ignore
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tagSearch, selectedTags]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedTags.length > 0) {
        formData.append('tagged_user_ids', JSON.stringify(selectedTags.map((t) => t.id)));
      }

      const response = await fetch(API_ENDPOINTS.CREATE_POST, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to create post');
        return;
      }

      setPosts((prev) => [data.post, ...prev]);
      setNewPostContent('');
      setSelectedTags([]);
      setTagSearch('');
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/like/`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, liked_by_me: data.liked, like_count: data.like_count } : p)));
      }
    } catch {
      // ignore
    }
  };

  const toggleComments = async (postId: number) => {
    const expanded = new Set(expandedComments);
    if (expanded.has(postId)) {
      expanded.delete(postId);
      setExpandedComments(expanded);
      return;
    }

    expanded.add(postId);
    setExpandedComments(expanded);

    if (postComments[postId]) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/`, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) setPostComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = commentTexts[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) return;

      setPostComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), data.comment] }));
      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p)));
    } catch {
      // ignore
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="social-page">
      <SiteHeader />
      <main className="social-wrap">
        <div className="create-post-card">
          <form onSubmit={handleCreatePost}>
            <textarea
              className="post-input"
              placeholder="Share a family memory..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
            />

            <div className="tag-input-wrapper">
              {selectedTags.map((tag) => (
                <span key={tag.id} className="tag-chip">
                  {tag.full_name || tag.username}
                  <button type="button" onClick={() => setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id))}>
                    x
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                className="tag-search-input"
                placeholder="Tag users"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                onFocus={() => tagSearch.length > 0 && setShowTagDropdown(true)}
                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              />
            </div>

            {showTagDropdown && tagResults.length > 0 && (
              <div className="tag-dropdown">
                {tagResults.map((u) => (
                  <button key={u.id} type="button" className="tag-option" onMouseDown={() => {
                    setSelectedTags((prev) => [...prev, u]);
                    setTagSearch('');
                    setShowTagDropdown(false);
                  }}>
                    @{u.username}
                  </button>
                ))}
              </div>
            )}

            <div className="post-actions-bar">
              <button type="submit" className="post-submit-btn" disabled={posting || !newPostContent.trim()}>
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading-state">Loading feed...</div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchPosts}>Retry</button>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <button className="post-author" onClick={() => navigate(`/profile/${post.author.username}`)}>
                    <span className="avatar-placeholder">{post.author.username[0].toUpperCase()}</span>
                    <span>{post.author.username}</span>
                  </button>
                  <span className="post-time">{formatDate(post.created_at)}</span>
                </div>

                <p className="post-text">{post.content}</p>

                <div className="post-footer">
                  <button className={`action-btn ${post.liked_by_me ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                    Like {post.like_count}
                  </button>
                  <button className="action-btn" onClick={() => toggleComments(post.id)}>
                    Comments {post.comment_count}
                  </button>
                </div>

                <div className="comment-input-row">
                  <input
                    className="comment-input"
                    placeholder="Write a comment"
                    value={commentTexts[post.id] || ''}
                    onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                  />
                </div>

                {expandedComments.has(post.id) && (
                  <div className="comments-section">
                    {(postComments[post.id] || []).map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <strong>{comment.author.username}</strong>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
