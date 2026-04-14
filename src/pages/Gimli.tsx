
import { Footer } from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';

export default function Gimli() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Gimli Saga</h1>
        <p style={{ color: 'var(--surface-muted)' }}>
          Help build the 150th anniversary chapter with your family stories, photos, and community history.
        </p>
      </main>
      <ProjectsSection />
      <Footer />
    </div>
  );
}
