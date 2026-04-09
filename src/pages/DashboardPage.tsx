import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { NudgeBubble } from "@/components/nudge-bubble";
import { PostCard } from "@/components/post-card";
import { API_ENDPOINTS } from "../config/api";
import { StoryInterviewModal } from "@/components/StoryInterviewModal";
import { PendingTagsNotification } from "@/components/recognition/PendingTagsNotification";

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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4bd46]/10 text-xs font-bold text-[#e4bd46]">
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

  useEffect(() => {
    // Fetch feed
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

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsStoryModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <DashboardNavbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar />
        
        <main className="flex-1 border-r border-[#262626] p-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
              <p className="text-white/50">Here's what's happening in your family circle.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e4bd46] border-t-transparent" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-[#262626] bg-[#171717] p-12 text-center">
                <p className="mb-4 text-white/50">Your feed is empty. Start by following some family members!</p>
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
                    className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))
              ) : (
                <>
                  <button onClick={() => handlePromptClick("What is your earliest childhood memory?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                    What is your earliest childhood memory?
                  </button>
                  <button onClick={() => handlePromptClick("What traditions did your family keep?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                    What traditions did your family keep?
                  </button>
                  <button onClick={() => handlePromptClick("Who was the storyteller in your family?")} className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                    Who was the storyteller in your family?
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Groups sidebar widget */}
          <GroupsSidebarWidget />
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
