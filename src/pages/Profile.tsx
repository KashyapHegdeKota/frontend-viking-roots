import Header from '../components/Header';
import { Footer } from '../components/Footer';
import GedcomUploader from '../components/GedcomUploader';
import ImageUpload from '../components/ImageUpload';

export default function ProfileSetup() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', display: 'grid', gap: 14 }}>
        <h1>Profile Setup</h1>
        <p style={{ color: 'var(--surface-muted)' }}>Complete your profile and upload your family assets.</p>
        <ImageUpload />
        <GedcomUploader />
      </main>
      <Footer />
    </div>
  );
}
