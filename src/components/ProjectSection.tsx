import { Link } from 'react-router-dom';

const items = [
  {
    title: 'The Viking Roots Project',
    description: 'Register, map your ancestry, and connect descendants across generations.',
    href: '/overview',
  },
  {
    title: 'Gimli Saga Book',
    description: 'Discover stories from the original publication and contribute new chapters.',
    href: '/gimli',
  },
  {
    title: 'Support the Mission',
    description: 'Help preserve heritage records and family stories for future generations.',
    href: '/overview',
  },
];

export default function ProjectsSection() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ color: 'var(--surface-fg)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>Explore Our Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
        {items.map((item) => (
          <article key={item.title} style={{ border: '1px solid var(--surface-border)', borderRadius: 12, background: 'var(--surface-elev)', padding: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>{item.title}</h3>
            <p style={{ color: 'var(--surface-muted)' }}>{item.description}</p>
            <Link to={item.href} style={{ color: '#b98d11', fontWeight: 700 }}>Learn more</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
