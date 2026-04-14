import { useRef, useState, useEffect } from 'react';
import * as f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import type { FamilyMember, MarriageEvent } from '../components/GedcomToJson';

import { Footer } from '../components/Footer';
import TimelinePanel from '../components/TimelinePanel';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const INJECTED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  :root {
    --gold-bright: #f7e08a;
    --gold-mid:    #c8961e;
    --gold-deep:   #7a5010;
    --gold-dim:    #3a2a08;
    --black-rich:  #08060200;
    --black-card:  #100d06;
    --black-panel: #0d0a05;
    --crimson:     #8b1a1a;
  }

  body { background: #080602 !important; }

  #FamilyChart path.link {
    stroke: var(--gold-deep) !important;
    stroke-width: 1.5px !important;
    opacity: 0.8;
  }

  #FamilyChart .card {
    border-radius: 2px !important;
    transition: box-shadow 0.25s, transform 0.2s !important;
    overflow: visible !important;
  }
  #FamilyChart .card-inner {
    border-radius: 2px !important;
    position: relative;
  }
  #FamilyChart .card-male .card-inner {
    background: linear-gradient(145deg, #1a1408 0%, #120e06 50%, #1e1a0a 100%) !important;
    border: 1px solid var(--gold-dim) !important;
    border-top: 2px solid var(--gold-mid) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,150,30,0.15) !important;
  }
  #FamilyChart .card-female .card-inner {
    background: linear-gradient(145deg, #160f14 0%, #0f0a10 50%, #1a1018 100%) !important;
    border: 1px solid #2a1828 !important;
    border-top: 2px solid #c07890 !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(192,120,144,0.15) !important;
  }
  #FamilyChart .card:hover .card-inner {
    box-shadow: 0 8px 36px rgba(200,150,30,0.3), 0 0 0 1px var(--gold-mid), inset 0 1px 0 rgba(247,224,138,0.25) !important;
    transform: translateY(-2px);
  }
  #FamilyChart .card-main .card-inner {
    box-shadow: 0 0 0 2px var(--gold-bright), 0 8px 40px rgba(200,150,30,0.55), inset 0 1px 0 rgba(247,224,138,0.3) !important;
  }

  #FamilyChart .card-label {
    color: var(--gold-bright) !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 0.95rem !important;
    letter-spacing: 0.03em;
  }
  #FamilyChart .card-label div:first-child {
    font-weight: 600;
    font-size: 1.05rem !important;
  }
  #FamilyChart .card-label div:not(:first-child) {
    color: var(--gold-mid) !important;
    font-size: 0.82rem !important;
    font-style: italic;
  }

  #FamilyChart .person-icon svg { color: var(--gold-deep) !important; }
  #FamilyChart .mini-tree svg   { color: var(--gold-mid) !important; }

  #FamilyChart .f3-form-cont {
    background: linear-gradient(170deg, #100d06 0%, #080602 100%) !important;
    border-left: 1px solid var(--gold-dim) !important;
    box-shadow: -12px 0 60px rgba(0,0,0,0.7), inset 1px 0 0 rgba(200,150,30,0.1) !important;
    font-family: 'Cormorant Garamond', serif !important;
    color: var(--gold-bright) !important;
  }
  #FamilyChart .f3-form-title {
    font-family: 'Cinzel', serif !important;
    color: var(--gold-bright) !important;
    letter-spacing: 0.1em !important;
    font-size: 0.9rem !important;
    border-bottom: 1px solid var(--gold-dim) !important;
    padding-bottom: 10px !important;
    margin-bottom: 14px !important;
  }
  #FamilyChart .f3-form label,
  #FamilyChart .f3-info-field-label {
    color: var(--gold-mid) !important;
    font-family: 'Cinzel', serif !important;
    font-size: 0.65rem !important;
    letter-spacing: 0.14em !important;
    text-transform: uppercase !important;
  }
  #FamilyChart .f3-form input,
  #FamilyChart .f3-form select,
  #FamilyChart .f3-form textarea {
    background: #1a1408 !important;
    border: 1px solid var(--gold-dim) !important;
    color: var(--gold-bright) !important;
    border-radius: 2px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1rem !important;
    transition: border-color 0.2s !important;
  }
  #FamilyChart .f3-form input:focus,
  #FamilyChart .f3-form select:focus {
    outline: none !important;
    border-color: var(--gold-mid) !important;
    box-shadow: 0 0 0 2px rgba(200,150,30,0.18) !important;
  }
  #FamilyChart .f3-info-field-value {
    color: var(--gold-bright) !important;
    font-size: 1rem !important;
    font-family: 'Cormorant Garamond', serif !important;
  }
  #FamilyChart .f3-form button[type="submit"] {
    background: linear-gradient(135deg, var(--gold-mid) 0%, var(--gold-deep) 100%) !important;
    color: #080602 !important;
    font-family: 'Cinzel', serif !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.14em !important;
    border: none !important;
    border-radius: 2px !important;
    cursor: pointer !important;
    transition: filter 0.2s !important;
  }
  #FamilyChart .f3-form button[type="submit"]:hover { filter: brightness(1.25) !important; }
  #FamilyChart .f3-form .f3-cancel-btn,
  #FamilyChart .f3-form .f3-delete-btn,
  #FamilyChart .f3-form .f3-remove-relative-btn {
    background: transparent !important;
    border: 1px solid var(--gold-dim) !important;
    color: var(--gold-mid) !important;
    font-family: 'Cinzel', serif !important;
    font-size: 0.65rem !important;
    letter-spacing: 0.1em !important;
    cursor: pointer !important;
    border-radius: 2px !important;
    transition: border-color 0.2s, color 0.2s !important;
  }
  #FamilyChart .f3-form .f3-cancel-btn:hover,
  #FamilyChart .f3-form .f3-remove-relative-btn:hover { border-color: var(--gold-bright) !important; color: var(--gold-bright) !important; }
  #FamilyChart .f3-form .f3-delete-btn:hover { border-color: #c04040 !important; color: #c04040 !important; }
  #FamilyChart .f3-close-btn { color: var(--gold-mid) !important; font-size: 1.4rem !important; }
  #FamilyChart .f3-close-btn:hover { color: var(--gold-bright) !important; }
  #FamilyChart .f3-edit-btn svg,
  #FamilyChart .f3-add-relative-btn svg { color: var(--gold-mid) !important; }
  #FamilyChart .f3-edit-btn:hover svg,
  #FamilyChart .f3-add-relative-btn:hover svg { color: var(--gold-bright) !important; }
  #FamilyChart .f3-radio-group label {
    color: var(--gold-bright) !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1rem !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
  }

  #FamilyChart .f3-history-controls button {
    background: transparent !important;
    border: 1px solid var(--gold-dim) !important;
    color: var(--gold-mid) !important;
    border-radius: 2px !important;
    transition: all 0.2s !important;
  }
  #FamilyChart .f3-history-controls button:hover { border-color: var(--gold-bright) !important; color: var(--gold-bright) !important; }
  #FamilyChart .f3-nav-cont { display: none !important; }

  #FamilyChart .card-to-add .card-inner {
    border-style: dashed !important;
    border-color: var(--gold-dim) !important;
    background: rgba(20,16,8,0.5) !important;
  }
`;

const FamilyTree = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const f3ChartRef = useRef<any>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [marriages] = useState<MarriageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [stats, setStats] = useState<{
    individualCount: number;
    familyCount: number;
    sampleIndividuals: Array<{ id: string; name: string }>;
  } | null>(null);

  const injectStyles = () => {
    if (styleRef.current) return;
    const tag = document.createElement('style');
    tag.textContent = INJECTED_STYLES;
    document.head.appendChild(tag);
    styleRef.current = tag;
  };

  const buildChart = (data: FamilyMember[]) => {
    if (!containerRef.current || data.length === 0) return;
    injectStyles();

    if (f3ChartRef.current) {
      try { f3ChartRef.current.editTreeInstance?.destroy(); } catch (_) {}
    }
    containerRef.current.innerHTML = '';
    containerRef.current.id = 'FamilyChart';

    try {
      const chart = f3.createChart('#FamilyChart', data as f3.Data);

      const cardHtml = chart
        .setCardHtml()
        .setCardDisplay([['first name', 'last name'], ['birthday']])
        .setMiniTree(true);

      const editTreeInst = chart.editTree();
      editTreeInst
        .setFields(['first name', 'last name', 'birthday', 'gender'])
        .setEditFirst(false)
        .setOnChange(() => {
          const updated = editTreeInst.exportData() as FamilyMember[];
          setFamilyData(updated);
        });

      editTreeInst.setCardClickOpen(cardHtml);
      chart.updateTree({ initial: true });
      f3ChartRef.current = chart;
    } catch (err) {
      console.error('Error creating chart:', err);
    }
  };

  const resetChart = () => {
    if (f3ChartRef.current) {
      try { f3ChartRef.current.editTreeInstance?.destroy(); } catch (_) {}
      f3ChartRef.current = null;
    }
    if (containerRef.current) containerRef.current.innerHTML = '';
  };

  const fetchTreeData = async () => {
    setIsLoading(true);
    resetChart();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/heritage/tree/`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch tree data');
      
      const data = await response.json();
      
      // The crucial step: Transforming your SQL data into f3's relational format
      const f3FormattedData = data.tree.map((anc: any) => {
      const nameParts = anc.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      return {
        id: anc.id,
        // This is where the magic happens: linking the nodes together
        rels: {
          father: anc.father_id,
          mother: anc.mother_id,
          spouses: anc.spouse_ids || [],
          children: anc.child_ids || []
        },
        data: {
          "first name": firstName,
          "last name": lastName,
          "birthday": anc.birth_year ? anc.birth_year.toString() : "",
          "gender": anc.gender === 'M' ? 'M' : anc.gender === 'F' ? 'F' : 'U',
          "avatar": anc.photos && anc.photos.length > 0 ? anc.photos[0].url : null
          }
        };
      });

      setFamilyData(f3FormattedData);
      buildChart(f3FormattedData);
      setShowTimeline(true);
      
      // Update stats based on SQL data
      setStats({
        individualCount: f3FormattedData.length,
        familyCount: Math.floor(f3FormattedData.length / 3), // Rough estimation
        sampleIndividuals: f3FormattedData.slice(0, 3).map((d: any) => ({ id: d.id, name: `${d.data['first name']} ${d.data['last name']}` }))
      });

    } catch (error) {
      console.error('Error fetching SQL tree data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTreeData();
  }, []);

  const gold = '#c8961e';
  const goldBright = '#f7e08a';
  const goldDim = '#3a2a08';
  const borderColor = '#2a1e06';

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: 'linear-gradient(180deg, #0a0702 0%, #060401 100%)',
      minHeight: '100vh',
      padding: '0',
    }}>
      

      {/* ── Decorative header bar ── */}
      <div style={{
        background: 'linear-gradient(90deg, #080602 0%, #1a1206 30%, #221808 50%, #1a1206 70%, #080602 100%)',
        borderBottom: `1px solid ${borderColor}`,
        padding: '28px 32px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36,
          borderTop: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36,
          borderTop: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, opacity: 0.6 }} />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            fontSize: '0.6rem', letterSpacing: '0.4em', color: gold,
            fontFamily: "'Cinzel', serif", textTransform: 'uppercase', marginBottom: 6, opacity: 0.8,
          }} />
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            fontWeight: 700,
            margin: 0,
            background: `linear-gradient(135deg, ${goldBright} 0%, ${gold} 50%, #a07018 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.12em',
          }}>
            ✦ Viking Roots ✦
          </h1>
          <div style={{
            height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
            marginTop: 12, opacity: 0.5,
          }} />
        </div>

        {/* controls row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'center' }}>

          <button
            onClick={fetchTreeData}
            disabled={isLoading}
            style={{
              border: `1px solid ${borderColor}`,
              background: '#100d06',
              color: goldBright,
              padding: '9px 16px',
              borderRadius: 2,
              fontFamily: "'Cinzel', serif",
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Syncing...' : '↻ Refresh Saga'}
          </button>

          {/* Timeline toggle button */}
          {familyData.length > 0 && (
            <button
              onClick={() => setShowTimeline(v => !v)}
              style={{
                background: showTimeline ? 'rgba(200,150,30,0.15)' : 'transparent',
                border: `1px solid ${showTimeline ? gold : goldDim}`,
                borderRadius: 2,
                padding: '9px 18px',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: showTimeline ? goldBright : gold,
                cursor: 'pointer',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-end',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
              onMouseOver={e => {
                if (!showTimeline) {
                  e.currentTarget.style.borderColor = gold;
                  e.currentTarget.style.color = goldBright;
                }
              }}
              onMouseOut={e => {
                if (!showTimeline) {
                  e.currentTarget.style.borderColor = goldDim;
                  e.currentTarget.style.color = gold;
                }
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>⧗</span>
              {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
            </button>
          )}

          {isLoading && (
            <span style={{ color: gold, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', alignSelf: 'flex-end' }}>
              Parsing records…
            </span>
          )}
        </div>

        {/* stats strip */}
        {stats && (
          <div style={{
            marginTop: 18,
            display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {[
              { label: 'Individuals', value: stats.individualCount },
              { label: 'Families', value: stats.familyCount },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700,
                  background: `linear-gradient(135deg, ${goldBright}, ${gold})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{value}</div>
                <div style={{
                  fontSize: '0.58rem', letterSpacing: '0.2em', color: gold,
                  fontFamily: "'Cinzel', serif", textTransform: 'uppercase', opacity: 0.75,
                }}>{label}</div>
              </div>
            ))}
            {stats.sampleIndividuals.slice(0, 3).map((ind) => (
              <div key={ind.id} style={{
                borderLeft: `1px solid ${borderColor}`, paddingLeft: 16,
                fontFamily: "'Cormorant Garamond', serif", color: goldBright, fontSize: '0.9rem',
                alignSelf: 'center', opacity: 0.7,
              }}>
                {ind.name}
              </div>
            ))}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 36, height: 36,
          borderBottom: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 36, height: 36,
          borderBottom: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, opacity: 0.6 }} />
      </div>

      {/* ── Empty state ── */}
      {familyData.length === 0 && !isLoading && (
        <div style={{
          textAlign: 'center', padding: '80px 40px',
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>⚜</div>
          <p style={{ color: gold, fontSize: '1.2rem', marginBottom: 8, fontStyle: 'italic' }}>
            Upload a GEDCOM file or load the example to begin
          </p>
        </div>
      )}

      {/* ── Main content: Timeline + Chart side by side ── */}
      {familyData.length > 0 && (
        <div style={{
          display: 'flex',
          height: '900px',
          background: 'radial-gradient(ellipse at 50% 30%, #141008 0%, #0a0702 60%, #060401 100%)',
          borderTop: `1px solid ${borderColor}`,
          overflow: 'hidden',
        }}>
          {/* Timeline Panel */}
          <TimelinePanel
            familyData={familyData}
            marriages={marriages}
            isVisible={showTimeline}
            onClose={() => setShowTimeline(false)}
          />

          {/* Chart canvas */}
          <div
            ref={containerRef}
            className="f3"
            style={{
              flex: 1,
              height: '100%',
              position: 'relative',
              minWidth: 0,
            }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FamilyTree;