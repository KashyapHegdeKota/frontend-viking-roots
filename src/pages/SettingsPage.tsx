import { DashboardNavbar } from "@/components/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { FaceEnrollment } from "@/components/recognition/FaceEnrollment";
import { FaceTaggingSettings } from "@/components/recognition/FaceTaggingSettings";
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
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <DashboardNavbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="space-y-8">
              {/* Face Tagging Review Section */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Pending Photo Tags</h2>
                {loadingTags ? (
                  <div className="animate-pulse h-20 bg-[#171717] rounded-xl" />
                ) : pendingTags.length === 0 ? (
                  <div className="rounded-xl border border-[#262626] bg-[#171717] p-8 text-center">
                    <p className="text-white/50">No pending tags to review.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingTags.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-4 rounded-xl border border-[#262626] bg-[#171717] p-4">
                        <img 
                          src={tag.post_image} 
                          alt="Tagged post" 
                          className="h-16 w-16 rounded-lg object-cover border border-[#262626]"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {tag.uploaded_by} tagged you
                          </p>
                          <p className="text-xs text-white/50">
                            Confidence: {Math.round(tag.confidence)}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReview(tag.id, 'reject')}
                            className="px-3 py-1.5 rounded-lg border border-[#262626] text-white text-xs font-bold hover:bg-red-500/10 hover:text-red-500"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleReview(tag.id, 'accept')}
                            className="px-3 py-1.5 rounded-lg bg-[#e4bd46] text-[#0a0a0a] text-xs font-bold"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Biometric Enrollment */}
              <section>
                <FaceEnrollment />
              </section>

              {/* Privacy Settings */}
              <section>
                <FaceTaggingSettings />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
