import { useState } from 'react';

import { Footer } from '../components/Footer';
import { API_BASE_URL } from '../config/api';

export default function ManualAncestoryEntry() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/heritage/ancestor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          relation,
          birth_year: birthYear ? parseInt(birthYear, 10) : null,
        }),
      });
      const data = await response.json();
      setMessage(response.ok ? 'Ancestor added.' : data.error || 'Failed to save ancestor.');
    } catch {
      setMessage('Network error.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Add Ancestor Manually</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, border: '1px solid var(--surface-border)', borderRadius: 12, background: 'var(--surface-elev)', padding: '1rem' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation" required />
          <input value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="Birth year" />
          <button type="submit">Save Ancestor</button>
        </form>
        {message ? <p style={{ color: 'var(--surface-muted)' }}>{message}</p> : null}
      </main>
      <Footer />
    </div>
  );
}
