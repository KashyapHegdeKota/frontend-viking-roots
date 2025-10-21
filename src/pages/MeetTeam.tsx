const MeetTeam = () => {
  const features = [
    {
      image: "/DB.jpeg",
      title: "Diana Bristow - Founder",
      description: "",
      href: "",
      buttonText: "Explore Phase 1"
    },
    {
      image: "/Ethel.webp",
      title: "Ethel Howard - Editor in Chief, 1973",
      description: "Ethel, who had to give up a Latin scholarship to the University of Chicago when her family returned to Winnipeg, attended Normal School, and taught first at wood, and then at Radwax School near Oak Point prior to her marriage. She and Dick farmed there for 15 years during the depression, and their four children, Lawrence Richard, who died at six weeks, Ray, Eileen (Linda), and Doris were born there.",
      href: "",
      buttonText: ""
    },
    {
      image: "/Stefansson.webp",
      title: "Ms. Stefansson",
      description: "Ethel Howard, on the left with Miss Stefansson on the right. They are holding the original wooden-covered copy of the book that was to become the Gimli Saga.",
      href: "",
      buttonText: ""
    }
  ];

  interface FeatureCardNBProps {
  image: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

const FeatureCardNB = ({ image, title, description, href, buttonText }: FeatureCardNBProps) => {
  return (
    <div className="feature-cardNB">
      <div className="feature-card-imageNB">
        <img src={image} alt={title} />
      </div>
      
      <div className="feature-card-contentNB">
        <h2 className="feature-card-titleNB">{title}</h2>
        <p className="feature-card-descriptionNB">{description}</p>
        
      </div>
    </div>
  );
};

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h1 className="projects-title">Meet the Team</h1>
        
      </div>

      <div className="projects-grid">
        {features.map((feature, index) => (
          <FeatureCardNB key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default MeetTeam;