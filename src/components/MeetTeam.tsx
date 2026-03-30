const members = [
  { name: 'Diana Bristow', role: 'Founder', image: '/img/featured-project.jpg' },
  { name: 'Ethel Howard', role: 'Editor in Chief, 1973', image: '/img/featured-project.jpg' },
  { name: 'Ms. Stefansson', role: 'Contributor', image: '/img/featured-project.jpg' },
];

export default function MeetTeam() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ color: 'var(--surface-fg)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>Meet the Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
        {members.map((member) => (
          <article key={member.name} style={{ border: '1px solid var(--surface-border)', borderRadius: 12, background: 'var(--surface-elev)', padding: '1rem' }}>
            <img src={member.image} alt={member.name} style={{ width: '100%', borderRadius: 8 }} />
            <h3 style={{ marginBottom: 4 }}>{member.name}</h3>
            <p style={{ color: 'var(--surface-muted)', marginTop: 0 }}>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
