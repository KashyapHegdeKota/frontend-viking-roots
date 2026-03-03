import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Fact { key: string; value: string; }

interface LocationResult {
  id: number;
  name: string;
  original_name: string;
  location_type: string;
}

interface DuplicateCandidate {
  id: string;
  name: string;
  birth_year: number | null;
  relation: string;
  score: number;
}

interface FormState {
  name: string;
  relation: string;
  gender: string;
  birth_year: string;
  birth_date: string;
  death_year: string;
  death_date: string;
  birth_location_name: string;
  birth_location_id: number | null;
  origin: string;
  facts: Fact[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COMMON_RELATIONS = [
  'Grandfather', 'Grandmother', 'Great-Grandfather', 'Great-Grandmother',
  'Father', 'Mother', 'Uncle', 'Aunt', 'Cousin', 'Sibling', 'Other',
];

const COMMON_FACT_KEYS = [
  'occupation', 'religion', 'emigration_ship', 'physical_description',
  'known_for', 'education', 'military_service', 'cause_of_death',
  'spoken_languages', 'property_owned',
];

const API_BASE = (import.meta as { env: Record<string, string> }).env.VITE_API_BASE_URL || 'http://localhost:8000';

const STEPS = ['Identity', 'Vital Stats', 'Facts & Stories', 'Review'];

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#c8a96e' : active ? '#1a1208' : '#2a2010',
                border: `2px solid ${active || done ? '#c8a96e' : '#3a2d1a'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? '#0a0704' : active ? '#c8a96e' : '#6b5a3a',
                fontSize: 13, fontWeight: 700, fontFamily: "'Cinzel', serif",
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                marginTop: 6, fontSize: 10, fontFamily: "'Cinzel', serif",
                color: active ? '#c8a96e' : '#4a3a22', letterSpacing: 1,
              }}>
                {label.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 2, height: 2, marginBottom: 18,
                background: i < current ? '#c8a96e' : '#2a2010',
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormField wrapper
// ---------------------------------------------------------------------------

function FormField({ label, children, hint }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', marginBottom: 6,
        color: '#8b7355', fontSize: 10,
        fontFamily: "'Cinzel', serif", letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '4px 0 0', color: '#4a3a22', fontSize: 11 }}>{hint}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', boxSizing: 'border-box',
  background: '#0f0b06', border: '1px solid #3a2d1a', borderRadius: 6,
  color: '#e8d5b0', fontFamily: "'Crimson Text', serif", fontSize: 15,
  outline: 'none',
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

// ---------------------------------------------------------------------------
// Location typeahead
// ---------------------------------------------------------------------------

function LocationTypeahead({ value, onSelect }: {
  value: string;
  onSelect: (name: string, id: number | null) => void;
}) {
  const [query, setQuery]     = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  // FIX: useRef must receive an initial value. null is correct for a timeout handle.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const search = useCallback((q: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res  = await fetch(
          `${API_BASE}/heritage/locations/?search=${encodeURIComponent(q)}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setResults(data.locations || []);
        setOpen(true);
      } catch { /* silent — typeahead failure is non-fatal */ }
      finally { setLoading(false); }
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSelect(e.target.value, null);
    search(e.target.value);
  };

  const pick = (loc: LocationResult) => {
    setQuery(loc.name);
    onSelect(loc.name, loc.id);
    setOpen(false);
    setResults([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="e.g. Gimli, Manitoba"
        style={inputStyle}
      />
      {loading && (
        <span style={{ position: 'absolute', right: 12, top: 11, color: '#6b5a3a', fontSize: 12 }}>
          searching…
        </span>
      )}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#120d06', border: '1px solid #3a2d1a', borderRadius: 6,
          marginTop: 2, maxHeight: 200, overflowY: 'auto',
        }}>
          {results.map(loc => (
            <div
              key={loc.id}
              onMouseDown={() => pick(loc)}
              style={{
                padding: '8px 14px', cursor: 'pointer',
                color: '#c8b88a', fontSize: 13, fontFamily: "'Crimson Text', serif",
                borderBottom: '1px solid #1a1208',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1a1208')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {loc.name}
              {loc.original_name && (
                <span style={{ color: '#4a3a22', marginLeft: 8, fontSize: 11 }}>
                  ({loc.original_name})
                </span>
              )}
            </div>
          ))}
          <div
            onMouseDown={() => { onSelect(query, null); setOpen(false); }}
            style={{
              padding: '8px 14px', cursor: 'pointer',
              color: '#8b6f47', fontSize: 12, fontFamily: "'Cinzel', serif", letterSpacing: 1,
            }}
          >
            + CREATE "{query}"
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Facts editor
// ---------------------------------------------------------------------------

function FactsEditor({ facts, onChange }: { facts: Fact[]; onChange: (f: Fact[]) => void }) {
  const [newKey, setNewKey]       = useState('');
  const [newValue, setNewValue]   = useState('');
  const [customKey, setCustomKey] = useState(false);

  const add = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    onChange([...facts, { key: newKey.trim(), value: newValue.trim() }]);
    setNewKey('');
    setNewValue('');
    setCustomKey(false);
  };

  const remove = (i: number) => onChange(facts.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {facts.map((f, i) => (
          <div key={i} style={{
            background: '#1a1208', border: '1px solid #3a2d1a', borderRadius: 20,
            padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: '#8b7355', fontSize: 11, fontFamily: "'Cinzel', serif" }}>
              {f.key}:
            </span>
            <span style={{ color: '#c8b88a', fontSize: 13, fontFamily: "'Crimson Text', serif" }}>
              {f.value}
            </span>
            <button
              onClick={() => remove(i)}
              style={{ background: 'none', border: 'none', color: '#4a3a22', cursor: 'pointer', fontSize: 14, padding: 0 }}
            >✕</button>
          </div>
        ))}
        {facts.length === 0 && (
          <p style={{ color: '#4a3a22', fontSize: 12, fontStyle: 'italic' }}>
            No facts added yet.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#6b5a3a', fontSize: 10, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
            FACT TYPE
          </label>
          {customKey ? (
            <input
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="custom key"
              style={{ ...inputStyle, marginTop: 4 }}
            />
          ) : (
            <select
              value={newKey}
              onChange={e => {
                if (e.target.value === '__custom__') { setCustomKey(true); setNewKey(''); }
                else setNewKey(e.target.value);
              }}
              style={{ ...selectStyle, marginTop: 4 }}
            >
              <option value="">Select…</option>
              {COMMON_FACT_KEYS.map(k => (
                <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
              ))}
              <option value="__custom__">+ Custom key…</option>
            </select>
          )}
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ color: '#6b5a3a', fontSize: 10, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
            VALUE
          </label>
          <input
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. Fisherman"
            style={{ ...inputStyle, marginTop: 4 }}
          />
        </div>
        <button
          onClick={add}
          style={{
            padding: '10px 18px', background: '#8b6f47', border: 'none',
            borderRadius: 6, color: '#0a0704',
            fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: 1, whiteSpace: 'nowrap',
          }}
        >+ ADD</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Duplicate warning
// ---------------------------------------------------------------------------

function DuplicateWarning({ candidates, onIgnore, onViewExisting }: {
  candidates: DuplicateCandidate[];
  onIgnore: () => void;
  onViewExisting: (id: string) => void;
}) {
  return (
    <div style={{
      background: '#1a1000', border: '1px solid #c8a96e',
      borderRadius: 8, padding: '16px 20px', marginBottom: 24,
    }}>
      <p style={{ margin: '0 0 10px', color: '#c8a96e', fontFamily: "'Cinzel', serif", fontSize: 13 }}>
        ⚠ Possible duplicates found
      </p>
      {candidates.map(c => (
        <div key={c.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 0', borderBottom: '1px solid #2a1f00',
        }}>
          <div>
            <span style={{ color: '#e8d5b0', fontFamily: "'Crimson Text', serif", fontSize: 14 }}>
              {c.name}
            </span>
            {c.birth_year && (
              <span style={{ color: '#6b5a3a', marginLeft: 8, fontSize: 12 }}>b. {c.birth_year}</span>
            )}
            <span style={{ color: '#4a3a22', marginLeft: 8, fontSize: 11 }}>
              {Math.round(c.score * 100)}% match
            </span>
          </div>
          <button
            onClick={() => onViewExisting(c.id)}
            style={{
              background: 'none', border: '1px solid #3a2d1a', borderRadius: 4,
              padding: '3px 10px', color: '#8b7355',
              fontFamily: "'Cinzel', serif", fontSize: 10, cursor: 'pointer',
            }}
          >VIEW</button>
        </div>
      ))}
      <button
        onClick={onIgnore}
        style={{
          marginTop: 12, background: 'none', border: 'none',
          color: '#8b6f47', fontFamily: "'Cinzel', serif",
          fontSize: 11, cursor: 'pointer', textDecoration: 'underline',
        }}
      >
        Not a duplicate — create anyway
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review card
// ---------------------------------------------------------------------------

function ReviewCard({ form }: { form: FormState }) {
  const rows: [string, string][] = [
    ['Name',       form.name],
    ['Relation',   form.relation],
    ['Gender',     form.gender === 'M' ? 'Male' : form.gender === 'F' ? 'Female' : form.gender || '—'],
    ['Born',       [form.birth_date, form.birth_year].filter(Boolean).join(' / ') || '—'],
    ['Died',       [form.death_date, form.death_year].filter(Boolean).join(' / ') || '—'],
    ['Birthplace', form.birth_location_name || form.origin || '—'],
  ];
  return (
    <div style={{ background: '#0f0b06', border: '1px solid #3a2d1a', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ background: '#1a1208', padding: '10px 16px', borderBottom: '1px solid #3a2d1a' }}>
        <span style={{ color: '#c8a96e', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 2 }}>
          ANCESTOR SUMMARY
        </span>
      </div>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', padding: '8px 16px', borderBottom: '1px solid #1a1208' }}>
          <span style={{ width: 110, color: '#6b5a3a', fontSize: 11, fontFamily: "'Cinzel', serif" }}>
            {label}
          </span>
          <span style={{ color: '#c8b88a', fontSize: 14, fontFamily: "'Crimson Text', serif" }}>{val}</span>
        </div>
      ))}
      {form.facts.length > 0 && (
        <div style={{ padding: '8px 16px' }}>
          <span style={{ color: '#6b5a3a', fontSize: 11, fontFamily: "'Cinzel', serif" }}>Facts</span>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {form.facts.map((f, i) => (
              <span key={i} style={{
                background: '#1a1208', border: '1px solid #3a2d1a',
                borderRadius: 12, padding: '2px 10px',
                color: '#c8b88a', fontSize: 12, fontFamily: "'Crimson Text', serif",
              }}>
                {f.key}: {f.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const INITIAL_FORM: FormState = {
  name: '', relation: '', gender: '',
  birth_year: '', birth_date: '', death_year: '', death_date: '',
  birth_location_name: '', birth_location_id: null, origin: '',
  facts: [],
};

export default function ManualAncestorEntry() {
  const navigate = useNavigate();

  const [step, setStep]             = useState(0);
  const [form, setForm]             = useState<FormState>(INITIAL_FORM);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [force, setForce]           = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const set = (field: keyof FormState, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // Pre-flight duplicate check triggered on name blur
  const checkDuplicates = useCallback(async () => {
    if (!form.name.trim() || force) return;
    try {
      const params = new URLSearchParams({ name: form.name });
      if (form.birth_year) params.set('birth_year', form.birth_year);
      const res  = await fetch(`${API_BASE}/api/heritage/ancestor/check-duplicates/?${params}`, { credentials: 'include' });
      const data = await res.json();
      setDuplicates(data.duplicates || []);
    } catch { /* non-fatal */ }
  }, [form.name, form.birth_year, force]);

  const canProceed = (): boolean => {
    if (step === 0) return form.name.trim().length > 0 && form.relation.trim().length > 0;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/heritage/ancestor/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name:                form.name.trim(),
          relation:            form.relation.trim(),
          gender:              form.gender,
          birth_year:          form.birth_year ? parseInt(form.birth_year) : null,
          birth_date:          form.birth_date || null,
          death_year:          form.death_year ? parseInt(form.death_year) : null,
          death_date:          form.death_date || null,
          birth_location_name: form.birth_location_name || null,
          birth_location_id:   form.birth_location_id,
          origin:              form.origin.trim() || null,
          facts:               form.facts,
          force,
        }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setDuplicates(data.duplicates || []);
        setStep(0);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Success screen
  // -------------------------------------------------------------------------
  if (success) {
    return (
      <div style={pageStyle}>
        <GoogleFonts />
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>ᚠ</div>
            <h2 style={{ color: '#c8a96e', fontFamily: "'Cinzel', serif", margin: '0 0 10px' }}>
              Ancestor Added to the Saga
            </h2>
            <p style={{ color: '#8b7355', fontFamily: "'Crimson Text', serif", fontSize: 16 }}>
              {form.name} has been woven into your family tree.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
              <button
                onClick={() => { setForm(INITIAL_FORM); setStep(0); setSuccess(false); setDuplicates([]); setForce(false); }}
                style={secondaryBtnStyle}
              >
                Add Another
              </button>
              <button onClick={() => navigate('/dashboard')} style={primaryBtnStyle}>
                View Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main form
  // -------------------------------------------------------------------------
  return (
    <div style={pageStyle}>
      <GoogleFonts />
      <div style={cardStyle}>
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#6b5a3a', cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, color: '#e8d5b0', fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
            Add an Ancestor
          </h1>
          <p style={{ margin: '6px 0 0', color: '#6b5a3a', fontFamily: "'Crimson Text', serif", fontSize: 14 }}>
            Weave a new thread into your family saga.
          </p>
        </div>

        <StepIndicator current={step} />

        {duplicates.length > 0 && !force && (
          <DuplicateWarning
            candidates={duplicates}
            onIgnore={() => { setForce(true); setDuplicates([]); }}
            onViewExisting={id => navigate(`/ancestor/${id}`)}
          />
        )}

        {error && (
          <div style={{
            background: '#1a0800', border: '1px solid #d9534f', borderRadius: 6,
            padding: '10px 16px', marginBottom: 20,
            color: '#e87a6e', fontFamily: "'Crimson Text', serif", fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* Step 0 — Identity */}
        {step === 0 && (
          <div>
            <FormField label="Full Name *">
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onBlur={checkDuplicates}
                placeholder="e.g. Björn Ironside"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Relation to You *" hint="How is this person related to you?">
              <select value={form.relation} onChange={e => set('relation', e.target.value)} style={selectStyle}>
                <option value="">Select relationship…</option>
                {COMMON_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Gender">
              <div style={{ display: 'flex', gap: 10 }}>
                {([['M', 'Male'], ['F', 'Female'], ['O', 'Other / Unknown']] as [string, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => set('gender', form.gender === val ? '' : val)}
                    style={{
                      flex: 1, padding: '9px 0',
                      background: form.gender === val ? '#2a1f0e' : 'transparent',
                      border: `1px solid ${form.gender === val ? '#c8a96e' : '#3a2d1a'}`,
                      borderRadius: 6,
                      color: form.gender === val ? '#c8a96e' : '#6b5a3a',
                      fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer', letterSpacing: 1,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {/* Step 1 — Vital Stats */}
        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Birth Year" hint="4-digit year">
                <input
                  type="number" min="1000" max="2100"
                  value={form.birth_year}
                  onChange={e => set('birth_year', e.target.value)}
                  onBlur={checkDuplicates}
                  placeholder="1872"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Birth Date" hint="If exact date is known">
                <input type="date" value={form.birth_date} onChange={e => set('birth_date', e.target.value)} style={inputStyle} />
              </FormField>
              <FormField label="Death Year">
                <input
                  type="number" min="1000" max="2100"
                  value={form.death_year}
                  onChange={e => set('death_year', e.target.value)}
                  placeholder="1945"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Death Date" hint="Optional">
                <input type="date" value={form.death_date} onChange={e => set('death_date', e.target.value)} style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Birthplace" hint="Start typing to search existing locations.">
              <LocationTypeahead
                value={form.birth_location_name}
                onSelect={(name, id) => { set('birth_location_name', name); set('birth_location_id', id); }}
              />
              {form.birth_location_id && (
                <p style={{ margin: '4px 0 0', color: '#68b27a', fontSize: 11 }}>
                  ✓ Matched to existing location (ID {form.birth_location_id})
                </p>
              )}
            </FormField>
            <FormField label="Origin (legacy)" hint="Plain-text fallback if no structured location available.">
              <input value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="e.g. Iceland" style={inputStyle} />
            </FormField>
          </div>
        )}

        {/* Step 2 — Facts */}
        {step === 2 && (
          <div>
            <p style={{ color: '#6b5a3a', fontFamily: "'Crimson Text', serif", fontSize: 14, marginTop: 0 }}>
              Add any extra details — occupation, religion, the ship they arrived on, physical traits, or anything else worth preserving.
            </p>
            <FactsEditor facts={form.facts} onChange={facts => set('facts', facts)} />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div>
            <p style={{ color: '#6b5a3a', fontFamily: "'Crimson Text', serif", fontSize: 14, marginTop: 0 }}>
              Review the details below before adding this ancestor to your saga.
            </p>
            <ReviewCard form={form} />
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
            style={secondaryBtnStyle}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              style={{ ...primaryBtnStyle, opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? 'pointer' : 'not-allowed' }}
            >
              Next →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} style={{ ...primaryBtnStyle, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Adding to Saga…' : 'Add to Saga ⚔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  minHeight: '100vh', background: '#080604',
  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  padding: '40px 16px',
};

const cardStyle: React.CSSProperties = {
  width: '100%', maxWidth: 620,
  background: 'linear-gradient(160deg, #120d06 0%, #1a1208 100%)',
  border: '1px solid #3a2d1a', borderRadius: 12,
  padding: '36px 40px',
  boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '11px 28px',
  background: 'linear-gradient(135deg, #8b6f47, #c8a96e)',
  border: 'none', borderRadius: 7,
  color: '#0a0704', fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700,
  cursor: 'pointer', letterSpacing: 1,
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '11px 24px', background: 'transparent',
  border: '1px solid #3a2d1a', borderRadius: 7,
  color: '#6b5a3a', fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 700,
  cursor: 'pointer', letterSpacing: 1,
};

function GoogleFonts() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
      rel="stylesheet"
    />
  );
}