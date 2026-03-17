import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { FamilyMember } from './GedcomToJSON';

export type TimelineEvent = {
  year: number;
  type: 'birth' | 'death' | 'marriage';
  label: string;
  subLabel?: string;
  personId?: string;
};

function extractYear(dateStr: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
  return match ? parseInt(match[1]) : null;
}

function buildEvents(
  familyData: FamilyMember[],
  marriages: Array<{ year: number; husbandName: string; wifeName: string }>
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  familyData.forEach((member) => {
    const firstName = member.data['first name'];
    const lastName = member.data['last name'];
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';

    const birthYear = extractYear(member.data.birthday || '');
    if (birthYear) {
      events.push({
        year: birthYear,
        type: 'birth',
        label: fullName,
        subLabel: member.data.birthday,
        personId: member.id,
      });
    }

    const deathYear = extractYear(member.data.death || '');
    if (deathYear) {
      events.push({
        year: deathYear,
        type: 'death',
        label: fullName,
        subLabel: member.data.death,
        personId: member.id,
      });
    }
  });

  marriages.forEach((m) => {
    events.push({
      year: m.year,
      type: 'marriage',
      label: `${m.husbandName} & ${m.wifeName}`,
      subLabel: `${m.year}`,
    });
  });

  return events.sort((a, b) => a.year - b.year);
}

const TYPE_CONFIG = {
  birth: {
    icon: '✦',
    color: '#c8961e',
    glowColor: 'rgba(200,150,30,0.5)',
    label: 'BIRTH',
    bgColor: 'rgba(200,150,30,0.08)',
  },
  death: {
    icon: '✝',
    color: '#8b5a5a',
    glowColor: 'rgba(139,90,90,0.5)',
    label: 'DEATH',
    bgColor: 'rgba(139,90,90,0.06)',
  },
  marriage: {
    icon: '◈',
    color: '#b0c4de',
    glowColor: 'rgba(176,196,222,0.5)',
    label: 'MARRIAGE',
    bgColor: 'rgba(176,196,222,0.06)',
  },
};

interface TimelinePanelProps {
  familyData: FamilyMember[];
  marriages?: Array<{ year: number; husbandName: string; wifeName: string }>;
  isVisible: boolean;
  onClose: () => void;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  familyData,
  marriages = [],
  isVisible,
  onClose,
}) => {
  const events = useMemo(() => buildEvents(familyData, marriages), [familyData, marriages]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'birth' | 'death' | 'marriage'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (activeFilter === 'all' ? events : events.filter((e) => e.type === activeFilter)),
    [events, activeFilter]
  );

  // Group events by decade for the era markers
  const decadeGroups = useMemo(() => {
    const groups: Record<number, TimelineEvent[]> = {};
    filtered.forEach((e) => {
      const decade = Math.floor(e.year / 10) * 10;
      if (!groups[decade]) groups[decade] = [];
      groups[decade].push(e);
    });
    return groups;
  }, [filtered]);

  const decades = Object.keys(decadeGroups)
    .map(Number)
    .sort((a, b) => a - b);

  const gold = '#c8961e';
  const goldBright = '#f7e08a';
  const goldDim = '#3a2a08';

  return (
    <div
      style={{
        width: isVisible ? 300 : 0,
        minWidth: isVisible ? 300 : 0,
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 300,
          height: '100%',
          background: 'linear-gradient(180deg, #0f0b05 0%, #0a0702 100%)',
          borderRight: `1px solid ${goldDim}`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          boxShadow: 'inset -12px 0 30px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
      >
        {/* Decorative top edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
          opacity: 0.5,
        }} />

        {/* Header */}
        <div style={{
          padding: '20px 18px 14px',
          borderBottom: `1px solid ${goldDim}`,
          flexShrink: 0,
          background: 'linear-gradient(180deg, #161008 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.55rem',
                letterSpacing: '0.35em',
                color: gold,
                textTransform: 'uppercase',
                opacity: 0.75,
                marginBottom: 3,
              }}>
                Chronicle of
              </div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${goldBright}, ${gold})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.08em',
              }}>
                Events
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: `1px solid ${goldDim}`,
                color: gold,
                width: 28,
                height: 28,
                borderRadius: 2,
                cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = goldBright;
                e.currentTarget.style.color = goldBright;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = goldDim;
                e.currentTarget.style.color = gold;
              }}
            >
              ✕
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            {(['all', 'birth', 'death', 'marriage'] as const).map((type) => {
              const count =
                type === 'all' ? events.length : events.filter((e) => e.type === type).length;
              const cfg = type === 'all'
                ? { color: goldBright, icon: '◆' }
                : TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  style={{
                    flex: 1,
                    background: activeFilter === type
                      ? 'rgba(200,150,30,0.12)'
                      : 'transparent',
                    border: `1px solid ${activeFilter === type ? gold : goldDim}`,
                    borderRadius: 2,
                    padding: '5px 4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: '0.65rem', color: cfg.color }}>{cfg.icon}</span>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: activeFilter === type ? goldBright : gold,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Filter label */}
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.5rem',
            letterSpacing: '0.25em',
            color: gold,
            opacity: 0.6,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            {activeFilter === 'all' ? 'All Events' : `${activeFilter} Events Only`}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            opacity: 0.4,
          }}>
            <div style={{ fontSize: '2rem', color: gold }}>⚜</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: gold,
              fontSize: '0.9rem',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '0 20px',
            }}>
              No dated events to display
            </div>
          </div>
        )}

        {/* Scrollable events */}
        {filtered.length > 0 && (
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 0 20px',
              scrollbarWidth: 'thin',
              scrollbarColor: `${goldDim} transparent`,
            }}
          >
            {decades.map((decade, decadeIdx) => (
              <div key={decade}>
                {/* Decade marker */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px 6px',
                  position: 'sticky',
                  top: 0,
                  background: 'linear-gradient(180deg, #0a0702 70%, transparent 100%)',
                  zIndex: 2,
                }}>
                  <div style={{
                    height: 1,
                    flex: 1,
                    background: `linear-gradient(90deg, transparent, ${goldDim})`,
                  }} />
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.58rem',
                    letterSpacing: '0.2em',
                    color: gold,
                    opacity: 0.6,
                    whiteSpace: 'nowrap',
                  }}>
                    {decade}s
                  </span>
                  <div style={{
                    height: 1,
                    flex: 1,
                    background: `linear-gradient(90deg, ${goldDim}, transparent)`,
                  }} />
                </div>

                {/* Events in this decade */}
                <div style={{ position: 'relative', paddingLeft: 18 }}>
                  {/* Vertical spine */}
                  <div style={{
                    position: 'absolute',
                    left: 30,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: `linear-gradient(180deg, ${goldDim} 0%, transparent 100%)`,
                    opacity: 0.5,
                  }} />

                  {decadeGroups[decade].map((event, i) => {
                    const cfg = TYPE_CONFIG[event.type];
                    const globalIdx = filtered.indexOf(event);
                    const isHovered = hoveredIndex === globalIdx;

                    return (
                      <div
                        key={`${event.year}-${event.label}-${i}`}
                        onMouseEnter={() => setHoveredIndex(globalIdx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 0,
                          padding: '6px 14px 6px 0',
                          marginLeft: 4,
                          cursor: 'default',
                          transition: 'background 0.2s',
                          borderRadius: 2,
                          background: isHovered ? cfg.bgColor : 'transparent',
                          position: 'relative',
                        }}
                      >
                        {/* Node on spine */}
                        <div style={{
                          width: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          paddingTop: 2,
                          position: 'relative',
                          zIndex: 1,
                        }}>
                          <div style={{
                            width: isHovered ? 9 : 7,
                            height: isHovered ? 9 : 7,
                            borderRadius: event.type === 'marriage' ? 2 : '50%',
                            background: cfg.color,
                            boxShadow: isHovered
                              ? `0 0 8px ${cfg.glowColor}, 0 0 2px ${cfg.color}`
                              : `0 0 3px ${cfg.glowColor}`,
                            transition: 'all 0.2s',
                            transform: event.type === 'marriage' && isHovered ? 'rotate(45deg)' : 'none',
                          }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Year + type badge */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginBottom: 2,
                          }}>
                            <span style={{
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: isHovered ? goldBright : gold,
                              letterSpacing: '0.04em',
                              transition: 'color 0.2s',
                            }}>
                              {event.year}
                            </span>
                            <span style={{
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.45rem',
                              letterSpacing: '0.18em',
                              color: cfg.color,
                              opacity: 0.8,
                              textTransform: 'uppercase',
                              paddingTop: 1,
                            }}>
                              {cfg.label}
                            </span>
                          </div>

                          {/* Name */}
                          <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '0.88rem',
                            fontWeight: isHovered ? 600 : 400,
                            color: isHovered ? goldBright : 'rgba(247,224,138,0.85)',
                            lineHeight: 1.3,
                            transition: 'all 0.2s',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {event.label}
                          </div>

                          {/* SubLabel (full date) if different from year */}
                          {event.subLabel && event.subLabel !== String(event.year) && (
                            <div style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: '0.72rem',
                              fontStyle: 'italic',
                              color: gold,
                              opacity: 0.6,
                              marginTop: 1,
                            }}>
                              {event.subLabel}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom ornament */}
            <div style={{
              textAlign: 'center',
              padding: '16px 0 4px',
              color: gold,
              opacity: 0.2,
              fontSize: '1rem',
            }}>
              ⚜
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePanel;