import { DashboardNavbar } from "@/components/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PostCard } from "@/components/post-card";
import { NudgeBubble } from "@/components/nudge-bubble";

const samplePosts = [
  {
    authorName: "Sarah Jónsdóttir",
    authorInitial: "S",
    circleName: "Family Circle",
    timeAgo: "3h ago",
    location: "Gimli, MB",
    likes: 24,
    comments: 7,
    tags: [
      { name: "Jónas Bristow" },
      { name: "Anna Bristow" },
      { name: "Martha", detail: "(age 6)" },
      { name: "David", detail: "(age 4)" },
    ],
    caption: "Summer 1958 – New car from Winnipeg! Dad was so proud of this Buick.",
    imagePlaceholder: "Family with 1958 Buick",
  },
  {
    authorName: "Robert & Elín",
    authorInitial: "R",
    circleName: "Iceland Trip Circle",
    timeAgo: "Yesterday",
    location: "Reykjavik, Iceland",
    likes: 41,
    comments: 12,
    tags: [
      { name: "Robert Sigurdson" },
      { name: "Elín Björk" },
    ],
    caption: "Our grandparents visited this exact waterfall in 1932. 90 years later, we're standing in the same spot.",
    imagePlaceholder: "Waterfall in Iceland",
  },
  {
    authorName: "Karen Erikkson",
    authorInitial: "K",
    circleName: "Heritage Circle",
    timeAgo: "2 days ago",
    location: "Winnipeg, MB",
    likes: 18,
    comments: 3,
    tags: [
      { name: "Erik Erikkson" },
      { name: "Sigrid Erikkson" },
    ],
    caption: "Found this in the attic — my grandparents on their wedding day, 1947. Does anyone recognize the church?",
    imagePlaceholder: "Wedding photo from 1947",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#1c1919]">
      <DashboardNavbar />

      <div className="mx-auto flex max-w-7xl">
        <DashboardSidebar />

        {/* Main feed */}
        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-6">
              <PostCard {...samplePosts[0]} />

              <NudgeBubble
                question="What was the first car you ever bought?"
                primaryAction="Answer"
                secondaryAction="Remind me later"
              />

              <PostCard {...samplePosts[1]} />

              <NudgeBubble
                question="Want to add their grandparents?"
                primaryAction="Yes"
                secondaryAction="Not now"
              />

              <PostCard {...samplePosts[2]} />

              <NudgeBubble
                question="Where was this photo taken?"
                primaryAction="Answer"
                secondaryAction="Later"
              />
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l border-[#2f2a2a] p-6 xl:flex">
          {/* Story prompts */}
          <div className="rounded-xl border border-[#2f2a2a] bg-[#1f1c1c] p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Story Prompts</h3>
            <div className="flex flex-col gap-3">
              <button className="rounded-lg border border-[#2f2a2a] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                What is your earliest childhood memory?
              </button>
              <button className="rounded-lg border border-[#2f2a2a] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                What traditions did your family keep?
              </button>
              <button className="rounded-lg border border-[#2f2a2a] p-3 text-left text-xs text-white/70 transition-colors hover:border-[#e4bd46]/40 hover:text-white">
                Who was the storyteller in your family?
              </button>
            </div>
          </div>

          {/* Suggested circles */}
          <div className="rounded-xl border border-[#2f2a2a] bg-[#1f1c1c] p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Suggested Circles</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "Gimli Saga Project", members: 234 },
                { name: "Icelandic Heritage", members: 189 },
                { name: "Prairie Families", members: 312 },
              ].map((circle) => (
                <div key={circle.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{circle.name}</p>
                    <p className="text-xs text-white/40">{circle.members} members</p>
                  </div>
                  <button className="rounded-full border border-[#e4bd46] px-3 py-1 text-xs font-bold text-[#e4bd46] transition-colors hover:bg-[#e4bd46] hover:text-[#1c1919]">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="rounded-xl border border-[#2f2a2a] bg-[#1f1c1c] p-4">
            <h3 className="mb-3 text-sm font-bold text-white">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {["#VintagePhotos", "#FamilyStories", "#GimliMB", "#IcelandicRoots", "#1950s", "#PrairieLife"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#2f2a2a] px-3 py-1 text-xs text-white/60 transition-colors hover:border-[#e4bd46]/40 hover:text-[#e4bd46]"
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
