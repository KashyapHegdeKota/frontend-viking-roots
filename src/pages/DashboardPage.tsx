import React, { useEffect, useState, useRef } from "react";
import { NudgeBubble } from "../components/nudge-bubble";
import { PostCard } from "../components/post-card";
import { API_ENDPOINTS } from "../config/api";
import { StoryInterviewModal } from "../components/StoryInterviewModal";
import { PendingTagsNotification } from "../components/recognition/PendingTagsNotification";

// Added TaggedUser interface
interface TaggedUser {
  id: number;
  username: string;
  full_name?: string;
  profile_picture_url: string | null;
}

const GroupsSidebarWidget = () => {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.GROUPS, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setGroups(data.groups?.slice(0, 3) || []))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  if (groups.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#262626] bg-[#171717] p-4">
      <h3 className="mb-3 text-sm font-bold text-white">Suggested Circles</h3>
      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c88a65]/10 text-xs font-bold text-[#c88a65]">
              {group.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold text-white">{group.name}</p>
              <p className="text-[10px] text-white/50">{group.member_count} members</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // New post state
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // --- ADDED: Tagging State & Refs ---
  const [tagSearch, setTagSearch] = useState('');
  const [tagResults, setTagResults] = useState<TaggedUser[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaggedUser[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const fetchFeed = () => {
    fetch(API_ENDPOINTS.POSTS, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeed();

    // Fetch dynamic story prompts
    fetch(API_ENDPOINTS.STORY_PROMPTS, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.prompts && Array.isArray(data.prompts)) {
          setPrompts(data.prompts);
        }
      })
      .catch(err => console.error("Error fetching prompts:", err));
  }, []);

  // --- ADDED: Tag Search Effect ---
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

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsStoryModalOpen(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !postImage) return;

    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent.trim());
      
      if (postImage) {
        formData.append('image', postImage);
      }

      // --- ADDED: Append tagged users to form data ---
      if (selectedTags.length > 0) {
        formData.append('tagged_user_ids', JSON.stringify(selectedTags.map((t) => t.id)));
      }

      const res = await fetch(API_ENDPOINTS.CREATE_POST, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        setPostContent("");
        setPostImage(null);
        
        // --- ADDED: Clear tag state on success ---
        setSelectedTags([]);
        setTagSearch('');
        
        fetchFeed(); // Re-fetch to show the new post
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-[#0a0a0a]">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-1">

        
        <main className="min-w-0 flex-1 border-[#262626] p-0 lg:border-r lg:p-6">
          <div className="mx-auto max-w-2xl">
            <PendingTagsNotification />
            
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white sm:text-2xl">Welcome back!</h1>
              <p className="text-white/50">Here's what's happening in your family circle.</p>
            </div>

            {/* Create Post Box */}
            <div className="mb-8 rounded-lg border border-[#262626] bg-[#171717] p-3 sm:p-4">
              <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a memory, photo, or update..."
                  className="w-full resize-none rounded-lg bg-[#0a0a0a] p-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#c88a65] min-h-[80px] border border-[#262626]"
                />
                
                {/* --- ADDED: Tag Input UI (Tailwind styled) --- */}
                <div className="relative flex flex-wrap items-center gap-2 rounded-lg border border-[#262626] bg-[#0a0a0a] p-2">
                  {selectedTags.map((tag) => (
                    <span key={tag.id} className="flex items-center gap-1 rounded-full bg-[#c88a65]/20 px-2 py-1 text-xs text-[#c88a65]">
                      {tag.full_name || tag.username}
                      <button 
                        type="button" 
                        onClick={() => setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id))}
                        className="text-white/50 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30 min-w-[120px]"
                    placeholder={selectedTags.length === 0 ? "Tag family members..." : ""}
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    onFocus={() => tagSearch.length > 0 && setShowTagDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                  />

                  {showTagDropdown && tagResults.length > 0 && (
                    <div className="absolute left-0 top-full z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-[#262626] bg-[#171717] shadow-lg">
                      {tagResults.map((u) => (
                        <button 
                          key={u.id} 
                          type="button" 
                          className="w-full px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#262626]"
                          onMouseDown={() => {
                            setSelectedTags((prev) => [...prev, u]);
                            setTagSearch('');
                            setShowTagDropdown(false);
                          }}
                        >
                          @{u.username} {u.full_name ? `(${u.full_name})` : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {postImage && (
                  <div className="relative w-max">
                    <img 
                      src={URL.createObjectURL(postImage)} 
                      alt="Upload preview" 
                      className="h-24 rounded-lg object-cover border border-[#262626]"
                    />
                    <button 
                      type="button" 
                      onClick={() => setPostImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white transition-transform hover:scale-110"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-[#262626] hover:text-white sm:justify-start sm:py-1.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Add Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPostImage(e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isPosting || (!postContent.trim() && !postImage)}
                    className="min-h-10 rounded-lg bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-5 py-2 text-sm font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white disabled:opacity-50 sm:min-h-0 sm:py-1.5"
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c88a65] border-t-transparent" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-lg border border-[#262626] bg-[#171717] p-6 text-center sm:p-12">
                <p className="mb-4 text-white/50">Your feed is empty. Be the first to share something!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post, i) => (
                  <div key={post.id}>
                    <PostCard post={post} />
                    {i === 0 && (
                      <div className="mt-6">
                        <NudgeBubble 
                          question="What traditions did your family keep?"
                          primaryAction="Answer"
                          secondaryAction="Later"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l border-[#262626] p-6 xl:flex">
          {/* Story prompts */}
          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Story Prompts</h3>
            <div className="flex flex-col gap-3">
              {prompts.length > 0 ? (
                prompts.map((prompt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#c88a65]/40 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))
              ) : (
                <>
                  <button onClick={() => handlePromptClick("What is your earliest childhood memory?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#c88a65]/40 hover:text-white">
                    What is your earliest childhood memory?
                  </button>
                  <button onClick={() => handlePromptClick("What traditions did your family keep?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#c88a65]/40 hover:text-white">
                    What traditions did your family keep?
                  </button>
                  <button onClick={() => handlePromptClick("Who was the storyteller in your family?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#c88a65]/40 hover:text-white">
                    Who was the storyteller in your family?
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Groups sidebar widget */}
          <GroupsSidebarWidget />
          
          {/* Trending */}
          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {["#VintagePhotos", "#FamilyStories", "#GimliMB", "#IcelandicRoots", "#1950s", "#PrairieLife"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#262626] px-3 py-1 text-xs text-white/60 transition-colors hover:border-[#c88a65]/40 hover:text-[#c88a65]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </aside>
      </div>

      <StoryInterviewModal 
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        initialPrompt={selectedPrompt || ""}
      />
    </div>
  );
}
