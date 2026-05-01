
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';
import MeetTeam from '../components/MeetTeam';

export default function About() {
  const { t } = useTranslation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--surface-fg)' }}>
      
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <h1>{t('pages.aboutTitle')}</h1>
        <p style={{ color: 'var(--surface-muted)' }}>
          {t('pages.aboutCopy')}
        </p>
      </main>
      <MeetTeam />
      <Footer />
    </div>
  );
}
