import { useState } from "react";

interface NudgeBubbleProps {
  question: string;
  primaryAction: string;
  secondaryAction: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export function NudgeBubble({
  question,
  primaryAction,
  secondaryAction,
  onPrimary,
  onSecondary,
}: NudgeBubbleProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative rounded-xl border border-[#c88a65]/30 bg-[#262626] p-4 shadow-lg">
      <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-[#c88a65]/30 bg-[#262626]" />

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white">{question}</p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-white/40 transition-colors hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={onPrimary}
          className="rounded-full bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-4 py-1.5 text-xs font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white"
        >
          {primaryAction}
        </button>
        <button
          onClick={onSecondary || (() => setDismissed(true))}
          className="text-xs font-semibold text-white/50 transition-colors hover:text-white"
        >
          {secondaryAction}
        </button>
      </div>
    </div>
  );
}
