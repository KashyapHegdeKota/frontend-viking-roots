import { useState } from "react";

interface PostTag {
  name: string;
  detail?: string;
}

interface PostCardProps {
  authorName: string;
  authorInitial: string;
  circleName: string;
  timeAgo: string;
  location?: string;
  imageUrl?: string;
  imagePlaceholder?: string;
  likes: number;
  comments: number;
  tags: PostTag[];
  caption: string;
}

export function PostCard({
  authorName,
  authorInitial,
  circleName,
  timeAgo,
  location,
  likes,
  comments,
  tags,
  caption,
  imagePlaceholder,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  function handleLike() {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  return (
    <article className="overflow-hidden rounded-xl border border-[#2f2a2a] bg-[#1f1c1c]">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4bd46] text-sm font-bold text-[#1c1919]">
            {authorInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{authorName}</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs font-semibold text-[#e4bd46]">{circleName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c5151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>{timeAgo}</span>
              {location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {location}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                </>
              )}
            </div>
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
      <div className="relative aspect-[4/3] w-full bg-[#2f2a2a]">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center text-white/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm">{imagePlaceholder || "Photo"}</span>
          </div>
        </div>
        {/* Tap to tag overlay */}
        <button className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          Tap to tag
        </button>
        {/* Carousel indicator */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Engagement bar */}
      <div className="flex items-center justify-between border-b border-[#2f2a2a] px-4 py-2.5">
        <div className="flex items-center gap-5">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-sm transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "#e4bd46" : "none"} stroke={liked ? "#e4bd46" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={liked ? "font-semibold text-[#e4bd46]" : "text-white/70"}>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{comments}</span>
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
        <div className="flex items-center gap-4">
          <button onClick={() => setSaved(!saved)} className="flex items-center gap-1.5 text-sm transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "#e4bd46" : "none"} stroke={saved ? "#e4bd46" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className={saved ? "font-semibold text-[#e4bd46]" : "text-white/70"}>Save</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share to Circle</span>
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span className="text-xs font-semibold text-white/40">Tagged:</span>
        {tags.map((tag) => (
          <button key={tag.name} className="rounded-full border border-[#2f2a2a] px-3 py-1 text-xs font-semibold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]">
            {tag.name}
            {tag.detail && <span className="ml-1 text-white/40">{tag.detail}</span>}
          </button>
        ))}
        <button className="rounded-full border border-dashed border-[#6c5151] px-3 py-1 text-xs font-semibold text-[#6c5151] transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]">
          + Tag
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm leading-relaxed text-white/80">{caption}</p>
      </div>

      {/* Comment input */}
      <div className="flex items-center gap-3 border-t border-[#2f2a2a] px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4bd46] text-xs font-bold text-[#1c1919]">
          S
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          className="h-9 flex-1 rounded-full border border-[#2f2a2a] bg-transparent px-4 text-sm text-white placeholder-[#6c5151] outline-none transition-colors focus:border-[#e4bd46]"
        />
        <button className="text-white/40 transition-colors hover:text-[#e4bd46]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        <button className="text-white/40 transition-colors hover:text-[#e4bd46]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </div>
    </article>
  );
}
