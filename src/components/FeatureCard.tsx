import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

const FeatureCard = ({ image, title, description, href, buttonText }: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <div className="feature-card">
      <div className="feature-card-image">
        <img src={image} alt={title} />
      </div>
      
      <div className="feature-card-content">
        <h2 className="feature-card-title">{title}</h2>
        <p className="feature-card-description">{description}</p>
        <button onClick={handleClick} className="feature-card-button">
          {buttonText}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
