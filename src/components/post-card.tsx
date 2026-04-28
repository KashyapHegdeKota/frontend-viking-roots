import { useState } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface TaggedUser {
  id: number;
  username: string;
}

export interface PostCardProps {
  post: {
    id: number;
    author: {
      username: string;
      profile_picture_url: string | null;
    };
    group?: { name: string } | null;
    created_at: string;
    image_url: string | null;
    like_count: number;
    comment_count: number;
    liked_by_me: boolean;
    tagged_users: TaggedUser[];
    content: string;
  };
}


function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PostCard({ post }: PostCardProps) {
  const postId = post.id;
  const authorUsername = post.author?.username || "Unknown";
  const authorProfilePicUrl = post.author?.profile_picture_url;
  const groupName = post.group?.name;
  const createdAt = post.created_at;
  const imageUrl = post.image_url;
  const likeCount = post.like_count || 0;
  const commentCount = post.comment_count || 0;
  const likedByMe = post.liked_by_me || false;
  const taggedUsers = post.tagged_users || [];
  const content = post.content || "";

  const [liked, setLiked] = useState(likedByMe);
  const [likes, setLikes] = useState(likeCount);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');

  const currentUser = localStorage.getItem('username') || '';
  const currentUserInitial = currentUser ? currentUser[0].toUpperCase() : '?';

  async function handleLike() {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(API_ENDPOINTS.LIKE_POST(postId), {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikes(data.like_count);
      }
    } catch {
      // optimistic fallback
      setLiked((l) => !l);
      setLikes((c) => liked ? c - 1 : c + 1);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const token = localStorage.getItem('authToken');
    try {
      await fetch(API_ENDPOINTS.POST_COMMENTS(postId), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({ content: comment }),
      });
      setComment('');
    } catch {
      // silently fail
    }
  }

  const authorInitial = authorUsername ? authorUsername[0].toUpperCase() : '?';

  return (
    <article className="overflow-hidden rounded-lg border border-[#262626] bg-[#171717] sm:rounded-xl">
      {/* Post header */}
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          {authorProfilePicUrl ? (
            <img
              src={authorProfilePicUrl}
              alt={authorUsername}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c88a65] text-sm font-bold text-[#0a0a0a]">
              {authorInitial}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="truncate text-sm font-bold text-white">{authorUsername}</span>
              {groupName && (
                <>
                  <span className="text-xs text-white/40">•</span>
                  <span className="truncate text-xs font-semibold text-[#c88a65]">{groupName}</span>
                </>
              )}
            </div>
            <div className="text-xs text-white/40">{timeAgo(createdAt)}</div>
          </div>
        </div>
        <button className="rounded-full p-1 text-white/40 transition-colors hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Post image */}
      {imageUrl ? (
        <img src={imageUrl} alt="post" className="w-full object-cover max-h-[480px]" />
      ) : (
        <div className="relative aspect-[4/3] w-full bg-[#262626]">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center text-white/20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-sm">No image</span>
            </div>
          </div>
        </div>
      )}

      {/* Engagement bar */}
      <div className="flex flex-col gap-2 border-b border-[#262626] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-sm transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#c88a65" : "none"} stroke={liked ? "#c88a65" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={liked ? "font-semibold text-[#c88a65]" : "text-white/70"}>{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{commentCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Share</span>
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#262626] py-2 text-sm transition-colors sm:w-auto sm:border-0 sm:py-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "#c88a65" : "none"} stroke={saved ? "#c88a65" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span className={saved ? "font-semibold text-[#c88a65]" : "text-white/70"}>Save</span>
        </button>
      </div>

      {/* Tagged users */}
      {taggedUsers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 sm:px-4">
          <span className="text-xs font-semibold text-white/40">Tagged:</span>
          {taggedUsers.map((u) => (
            <span key={u.id} className="rounded-full border border-[#262626] px-3 py-1 text-xs font-semibold text-white">
              @{u.username}
            </span>
          ))}
        </div>
      )}

      {/* Caption */}
      <div className="px-3 pb-2 pt-2 sm:px-4">
        <p className="text-sm leading-relaxed text-white/80">{content}</p>
      </div>

      {/* Comment input */}
      <form onSubmit={handleComment} className="flex items-center gap-2 border-t border-[#262626] px-3 py-3 sm:gap-3 sm:px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c88a65] text-xs font-bold text-[#0a0a0a]">
          {currentUserInitial}
        </div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="h-9 min-w-0 flex-1 rounded-full border border-[#262626] bg-transparent px-3 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#c88a65] sm:px-4"
        />
        <button type="submit" className="text-white/40 transition-colors hover:text-[#c88a65]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </article>
  );
}
