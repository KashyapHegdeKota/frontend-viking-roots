import FeatureCard from './FeatureCard';

const ProjectsSection = () => {
  const features = [
    {
      image: "/Phase1.jpg",
      title: "The Viking Roots Project Phase 1",
      description: "In the first phase of this project, you can register your information and begin discovering your ancestral connections. Join thousands of others in mapping the Viking diaspora.",
      href: "/overview",
      buttonText: "Explore Phase 1"
    },
    {
      image: "/Gimli Saga.png",
      title: "Gimli Saga Book",
      description: "The Gimli Saga brings the reader face-to-face with the lives, struggles, and triumphs of Icelandic settlers in Manitoba. A captivating journey through history.",
      href: "/gimli",
      buttonText: "Discover the Saga"
    },
    {
      image: "/Donate.jpg",
      title: "Support Our Mission",
      description: "If you would like to support our work and help preserve Viking heritage for future generations, your contribution makes a meaningful difference.",
      href: "/donate",
      buttonText: "Donate Now"
    }
  ];

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h1 className="projects-title">Explore Our Projects</h1>
        <p className="projects-description">
          Discover the various initiatives that connect modern Vikings with their ancestral heritage
        </p>
      </div>

      <div className="projects-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
