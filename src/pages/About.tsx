import Header from '../components/Header';
import { Footer } from '../components/Footer';
import MeetTeam from '../components/MeetTeam';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>The Viking Roots Story</h1>
        <p style={{ color: 'var(--surface-muted)' }}>
          Join the Viking Roots and Gimli Saga journey to preserve, discover, and celebrate family stories across generations.
        </p>
      </main>
      <MeetTeam />
      <Footer />
    </div>
  );
}
