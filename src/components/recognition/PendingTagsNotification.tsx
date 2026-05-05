import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

export function PendingTagsNotification() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingTags();
  }, []);

  const fetchPendingTags = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.RECOGNITION_PENDING_TAGS, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setPendingCount(data.pending_tags?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching pending tags:', err);
    }
  };

  if (pendingCount === 0) return null;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">👤</span>
        <div>
          <p className="text-sm font-bold text-foreground">Pending Tag Suggestions</p>
          <p className="text-xs text-muted-foreground">You have {pendingCount} new photo tags to review.</p>
        </div>
      </div>
      <Link
        to="/settings"
        className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold transition-all hover:opacity-90 hover:scale-105"
      >
        Review Now
      </Link>
    </div>
  );
}