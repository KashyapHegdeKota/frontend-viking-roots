import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PostCard, PostCardProps } from "@/components/post-card";
import { NudgeBubble } from "@/components/nudge-bubble";
import { API_ENDPOINTS } from "@/config/api";

interface ApiPost {
  id: number;
  author: { id: number; username: string; profile_picture_url: string | null };
  content: string;
  image_url: string | null;
  tagged_users: { id: number; username: string }[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  group: { id: number; name: string } | null;
  created_at: string;
}

function mapPost(p: ApiPost): PostCardProps {
  return {
    postId: p.id,
    authorUsername: p.author.username,
    authorProfilePicUrl: p.author.profile_picture_url,
    groupName: p.group?.name ?? null,
    createdAt: p.created_at,
    imageUrl: p.image_url,
    likeCount: p.like_count,
    commentCount: p.comment_count,
    likedByMe: p.liked_by_me,
    taggedUsers: p.tagged_users,
    content: p.content,
  };
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(API_ENDPOINTS.POSTS, {
      credentials: 'include',
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts.map(mapPost));
        } else {
          setError('Failed to load posts.');
        }
      })
      .catch(() => setError('Network error loading posts.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardNavbar />

      <div className="mx-auto flex max-w-7xl">
        <DashboardSidebar />

        {/* Main feed */}
        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            {loading ? (
              <p className="text-center text-white/40 py-12">Loading posts...</p>
            ) : error ? (
              <p className="text-center text-red-400 py-12">{error}</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-white/40 py-12">No posts yet. Be the first to post!</p>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post, i) => (
                  <>
                    <PostCard key={post.postId} {...post} />
                    {(i + 1) % 2 === 0 && (
                      <NudgeBubble
                        key={`nudge-${i}`}
                        question="What traditions did your family keep?"
                        primaryAction="Answer"
                        secondaryAction="Later"
                      />
                    )}
                  </>
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
              <button className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                What is your earliest childhood memory?
              </button>
              <button className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                What traditions did your family keep?
              </button>
              <button className="rounded-lg border border-[#262626] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                Who was the storyteller in your family?
              </button>
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
                    className="rounded-full border border-[#262626] px-3 py-1 text-xs text-white/60 transition-colors hover:border-[#e4bd46]/40 hover:text-[#e4bd46]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GroupsSidebarWidget() {
  const [groups, setGroups] = useState<{ id: number; name: string; member_count: number }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(API_ENDPOINTS.GROUPS, {
      credentials: 'include',
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => { if (d.groups) setGroups(d.groups.slice(0, 3)); })
      .catch(() => {});
  }, []);

  if (groups.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#262626] bg-[#171717] p-4">
      <h3 className="mb-3 text-sm font-bold text-white">Groups</h3>
      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{g.name}</p>
              <p className="text-xs text-white/40">{g.member_count} members</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
