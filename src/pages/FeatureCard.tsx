interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

const FeatureCard = ({ image, title, description, href, buttonText }: FeatureCardProps) => {
  return (
    <div className="feature-card">
      <div className="feature-card-image">
        <img src={image} alt={title} />
      </div>
      
      <div className="feature-card-content">
        <h2 className="feature-card-title">{title}</h2>
        <p className="feature-card-description">{description}</p>
        <a href={href} className="feature-card-button">
          {buttonText}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeatureCard;