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
// Shared styles (Updated to standard theme)
// ---------------------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb', // Light gray background
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '40px 16px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: '#111',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 620,
  backgroundColor: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: '12px',
  padding: '36px 40px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '11px 28px',
  backgroundColor: '#8b5cf6', // Standard Purple Accent
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '11px 24px',
  backgroundColor: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  color: '#666',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  color: '#111',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: done ? '#8b5cf6' : active ? '#f3f4f6' : '#fff',
                border: `2px solid ${active || done ? '#8b5cf6' : '#e5e5e5'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? '#fff' : active ? '#8b5cf6' : '#9ca3af',
                fontSize: 14, fontWeight: 600,
                transition: 'all 0.3s ease',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                marginTop: 8, fontSize: 12, fontWeight: 500,
                color: active ? '#111' : '#6b7280',
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 2, height: 2, marginBottom: 20,
                backgroundColor: i < current ? '#8b5cf6' : '#e5e5e5',
                transition: 'background-color 0.3s ease',
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

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string; }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', marginBottom: 8,
        color: '#374151', fontSize: 13, fontWeight: 600,
      }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 12 }}>{hint}</p>}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Location typeahead
// ---------------------------------------------------------------------------

function LocationTypeahead({ value, onSelect }: { value: string; onSelect: (name: string, id: number | null) => void; }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const search = useCallback((q: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/heritage/locations/?search=${encodeURIComponent(q)}`, { credentials: 'include' });
        const data = await res.json();
        setResults(data.locations || []);
        setOpen(true);
      } catch { /* silent */ }
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
        <span style={{ position: 'absolute', right: 12, top: 11, color: '#9ca3af', fontSize: 12 }}>
          searching…
        </span>
      )}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 6,
          marginTop: 4, maxHeight: 200, overflowY: 'auto',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          {results.map(loc => (
            <div
              key={loc.id}
              onMouseDown={() => pick(loc)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                color: '#111', fontSize: 14,
                borderBottom: '1px solid #f3f4f6',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              {loc.name}
              {loc.original_name && (
                <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 12 }}>
                  ({loc.original_name})
                </span>
              )}
            </div>
          ))}
          <div
            onMouseDown={() => { onSelect(query, null); setOpen(false); }}
            style={{
              padding: '10px 14px', cursor: 'pointer',
              color: '#8b5cf6', fontSize: 13, fontWeight: 500,
            }}
          >
            + Create "{query}"
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
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {facts.map((f, i) => (
          <div key={i} style={{
            backgroundColor: '#f3f4f6', border: '1px solid #e5e5e5', borderRadius: 20,
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>
              {f.key}:
            </span>
            <span style={{ color: '#111', fontSize: 14 }}>
              {f.value}
            </span>
            <button
              onClick={() => remove(i)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14, padding: 0, marginLeft: 4 }}
            >✕</button>
          </div>
        ))}
        {facts.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
            No facts added yet.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#374151', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Fact Type
          </label>
          {customKey ? (
            <input
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="e.g. Favorite Book"
              style={inputStyle}
            />
          ) : (
            <select
              value={newKey}
              onChange={e => {
                if (e.target.value === '__custom__') { setCustomKey(true); setNewKey(''); }
                else setNewKey(e.target.value);
              }}
              style={selectStyle}
            >
              <option value="">Select…</option>
              {COMMON_FACT_KEYS.map(k => (
                <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
              ))}
              <option value="__custom__">+ Custom type…</option>
            </select>
          )}
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ color: '#374151', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Value
          </label>
          <input
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. Fisherman"
            style={inputStyle}
          />
        </div>
        <button
          onClick={add}
          style={{
            padding: '10px 20px', backgroundColor: '#111', border: 'none',
            borderRadius: '6px', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', height: '40px'
          }}
        >Add</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Duplicate warning
// ---------------------------------------------------------------------------

function DuplicateWarning({ candidates, onIgnore, onViewExisting }: { candidates: DuplicateCandidate[]; onIgnore: () => void; onViewExisting: (id: string) => void; }) {
  return (
    <div style={{
      backgroundColor: '#fffbeb', border: '1px solid #fcd34d',
      borderRadius: 8, padding: '16px 20px', marginBottom: 24,
    }}>
      <p style={{ margin: '0 0 12px', color: '#b45309', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        ⚠️ Possible duplicates found
      </p>
      {candidates.map(c => (
        <div key={c.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderBottom: '1px solid #fde68a',
        }}>
          <div>
            <span style={{ color: '#111', fontWeight: 500, fontSize: 14 }}>
              {c.name}
            </span>
            {c.birth_year && (
              <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 13 }}>b. {c.birth_year}</span>
            )}
            <span style={{ color: '#d97706', marginLeft: 8, fontSize: 12, fontWeight: 500 }}>
              {Math.round(c.score * 100)}% match
            </span>
          </div>
          <button
            onClick={() => onViewExisting(c.id)}
            style={{
              backgroundColor: '#fff', border: '1px solid #fcd34d', borderRadius: 4,
              padding: '4px 12px', color: '#b45309', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >Review</button>
        </div>
      ))}
      <button
        onClick={onIgnore}
        style={{
          marginTop: 16, background: 'none', border: 'none',
          color: '#6b7280', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0
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
    ['Name', form.name],
    ['Relation', form.relation],
    ['Gender', form.gender === 'M' ? 'Male' : form.gender === 'F' ? 'Female' : form.gender || '—'],
    ['Born', [form.birth_date, form.birth_year].filter(Boolean).join(' / ') || '—'],
    ['Died', [form.death_date, form.death_year].filter(Boolean).join(' / ') || '—'],
    ['Birthplace', form.birth_location_name || form.origin || '—'],
  ];
  return (
    <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>
        <span style={{ color: '#4b5563', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Ancestor Summary
        </span>
      </div>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid #e5e5e5' }}>
          <span style={{ width: 120, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>
            {label}
          </span>
          <span style={{ color: '#111', fontSize: 14 }}>{val}</span>
        </div>
      ))}
      {form.facts.length > 0 && (
        <div style={{ padding: '12px 16px' }}>
          <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Facts</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {form.facts.map((f, i) => (
              <span key={i} style={{
                backgroundColor: '#fff', border: '1px solid #ccc',
                borderRadius: 16, padding: '4px 12px',
                color: '#374151', fontSize: 13,
              }}>
                <strong>{f.key}:</strong> {f.value}
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

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [force, setForce] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormState, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const checkDuplicates = useCallback(async () => {
    if (!form.name.trim() || force) return;
    try {
      const params = new URLSearchParams({ name: form.name });
      if (form.birth_year) params.set('birth_year', form.birth_year);
      const res = await fetch(`${API_BASE}/api/heritage/ancestor/check-duplicates/?${params}`, { credentials: 'include' });
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
      const res = await fetch(`${API_BASE}/api/heritage/ancestor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          relation: form.relation.trim(),
          gender: form.gender,
          birth_year: form.birth_year ? parseInt(form.birth_year) : null,
          birth_date: form.birth_date || null,
          death_year: form.death_year ? parseInt(form.death_year) : null,
          death_date: form.death_date || null,
          birth_location_name: form.birth_location_name || null,
          birth_location_id: form.birth_location_id,
          origin: form.origin.trim() || null,
          facts: form.facts,
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
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 64, height: 64, backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a', fontSize: 32 }}>
              ✓
            </div>
            <h2 style={{ color: '#111', fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
              Successfully Added
            </h2>
            <p style={{ color: '#666', fontSize: 16, marginBottom: 32 }}>
              <strong>{form.name}</strong> has been added to your family tree.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => { setForm(INITIAL_FORM); setStep(0); setSuccess(false); setDuplicates([]); setForce(false); }}
                style={secondaryBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                Add Another Person
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={primaryBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7c3aed')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#8b5cf6')}
              >
                View Dashboard
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
      <div style={cardStyle}>
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, fontWeight: 500, marginBottom: 20, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, color: '#111', fontSize: 28, fontWeight: 700 }}>
            Add an Ancestor
          </h1>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 15 }}>
            Manually enter details for a family member.
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
            backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '12px 16px', marginBottom: 24, color: '#dc2626', fontSize: 14, fontWeight: 500
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
                placeholder="e.g. Jane Doe"
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
              <div style={{ display: 'flex', gap: 12 }}>
                {([['M', 'Male'], ['F', 'Female'], ['O', 'Other / Unknown']] as [string, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => set('gender', form.gender === val ? '' : val)}
                    style={{
                      flex: 1, padding: '10px 0',
                      backgroundColor: form.gender === val ? '#f3e8ff' : '#fff',
                      border: `1px solid ${form.gender === val ? '#8b5cf6' : '#e5e5e5'}`,
                      borderRadius: '6px',
                      color: form.gender === val ? '#6d28d9' : '#4b5563',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FormField label="Birth Year" hint="4-digit year">
                <input
                  type="number" min="1000" max="2100"
                  value={form.birth_year}
                  onChange={e => set('birth_year', e.target.value)}
                  onBlur={checkDuplicates}
                  placeholder="e.g. 1950"
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
                  placeholder="e.g. 2020"
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
                <p style={{ margin: '6px 0 0', color: '#059669', fontSize: 13, fontWeight: 500 }}>
                  ✓ Matched to existing location
                </p>
              )}
            </FormField>
            <FormField label="Origin (Legacy)" hint="Plain-text fallback if no structured location is available.">
              <input value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="e.g. Manitoba, Canada" style={inputStyle} />
            </FormField>
          </div>
        )}

        {/* Step 2 — Facts */}
        {step === 2 && (
          <div>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 0, marginBottom: 20, lineHeight: 1.5 }}>
              Add any extra details such as occupation, religion, immigration details, or personal traits.
            </p>
            <FactsEditor facts={form.facts} onChange={facts => set('facts', facts)} />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 0, marginBottom: 20 }}>
              Please review the details below before adding this person to your tree.
            </p>
            <ReviewCard form={form} />
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e5e5' }}>
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
            style={secondaryBtnStyle}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              style={{ ...primaryBtnStyle, opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed' }}
              onMouseEnter={e => canProceed() && (e.currentTarget.style.backgroundColor = '#7c3aed')}
              onMouseLeave={e => canProceed() && (e.currentTarget.style.backgroundColor = '#8b5cf6')}
            >
              Next Step →
            </button>
          ) : (
            <button 
              onClick={submit} 
              disabled={submitting} 
              style={{ ...primaryBtnStyle, backgroundColor: '#111', opacity: submitting ? 0.7 : 1 }}
              onMouseEnter={e => !submitting && (e.currentTarget.style.backgroundColor = '#333')}
              onMouseLeave={e => !submitting && (e.currentTarget.style.backgroundColor = '#111')}
            >
              {submitting ? 'Saving...' : 'Save Ancestor'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}