import { FaceEnrollment } from "@/components/recognition/FaceEnrollment";
import { FaceTaggingSettings } from "@/components/recognition/FaceTaggingSettings";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export default function SettingsPage() {
  const [pendingTags, setPendingTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    fetchPendingTags();
  }, []);

  const fetchPendingTags = async () => {
    setLoadingTags(true);
    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_PENDING_TAGS, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setPendingTags(data.pending_tags || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleReview = async (tagId: number, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_REVIEW_TAG(tagId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
        credentials: 'include'
      });
      if (res.ok) {
        setPendingTags(prev => prev.filter(t => t.id !== tagId));
      }
    } catch (err) {
      console.error('Error reviewing tag:', err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <ThemeToggle />
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Pending Photo Tags</h2>
                {loadingTags ? (
                  <div className="animate-pulse h-20 bg-muted rounded-xl" />
                ) : pendingTags.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground/70">No pending tags to review.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingTags.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                        <img
                          src={tag.post_image}
                          alt="Tagged post"
                          className="h-16 w-16 rounded-lg object-cover border border-border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {tag.uploaded_by} tagged you
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Confidence: {Math.round(tag.confidence)}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(tag.id, 'reject')}
                            className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleReview(tag.id, 'accept')}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold transition-all hover:opacity-90"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="text-foreground">
                <FaceEnrollment />
              </section>

              <section className="text-foreground">
                <FaceTaggingSettings />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}