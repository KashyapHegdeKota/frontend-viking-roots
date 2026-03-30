import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { API_BASE_URL } from '../config/api';

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
}

interface Ancestor {
  id: string;
  name: string;
  relation: string;
  birth_year: number | null;
  death_year: number | null;
}

export default function HeritageDashboard() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [timelineRes, treeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/heritage/timeline/`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/heritage/tree/`, { credentials: 'include' }),
        ]);
        const timelineData = await timelineRes.json();
        const treeData = await treeRes.json();
        setTimeline(timelineData.timeline || []);
        setAncestors(treeData.tree || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Heritage Dashboard</h1>
        {loading ? <p>Loading...</p> : null}
        <section style={{ display: 'grid', gap: 10 }}>
          <h2>Timeline</h2>
          {timeline.map((item) => (
            <article key={item.id} style={{ border: '1px solid var(--surface-border)', borderRadius: 10, background: 'var(--surface-elev)', padding: '0.75rem' }}>
              <strong>{item.year}</strong> {item.title}
              <p style={{ color: 'var(--surface-muted)' }}>{item.description}</p>
            </article>
          ))}
        </section>
        <section style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <h2>Family Tree</h2>
          {ancestors.map((a) => (
            <article key={a.id} style={{ border: '1px solid var(--surface-border)', borderRadius: 10, background: 'var(--surface-elev)', padding: '0.75rem' }}>
              <strong>{a.name}</strong> ({a.relation})
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
