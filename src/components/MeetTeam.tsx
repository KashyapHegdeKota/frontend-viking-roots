import { useTranslation } from 'react-i18next';

const members = [
  { name: 'Diana Bristow', roleKey: 'team.founder', image: '/public/DB.jpeg' },
] as const;

export default function MeetTeam() {
  const { t } = useTranslation();

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--surface-fg)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t('team.title')}</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {members.map((member) => (
          <article key={member.name} style={{ border: '1px solid var(--surface-border)', borderRadius: 12, background: 'var(--surface-elev)', padding: '1rem', maxWidth: 350, width: '100%' }}>
            <img src={member.image} alt={member.name} style={{ width: '100%', borderRadius: 8 }} />
            <h3 style={{ marginBottom: 4 }}>{member.name}</h3>
            <p style={{ color: 'var(--surface-muted)', marginTop: 0 }}>{t(member.roleKey)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
