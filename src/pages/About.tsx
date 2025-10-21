import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MeetTeam from '../components/MeetTeam';
import '../styles/components.css';

interface AboutPageProps {
  shipImage?: string; // optional, defaults if not provided
}

const AboutPage: React.FC<AboutPageProps> = ({  shipImage = '/Ship.webp' }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${shipImage})` }} // dynamically set background
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            The Viking Roots Story
          </h1>
          <p className="hero-description">
           Join the Viking Roots & Gimli Saga Project and become part of a journey started by the trailblazing women of Gimli in 1975. Discover the rich tapestry of Icelandic heritage woven into the community's history, and help trace the remarkable stories and descendants of those who shaped Gimli and Canada. It's time to preserve the past and celebrate the vibrant legacy that continues to thrive today!
          </p>
          <button onClick={() => navigate('/register')} className="hero-button">
            Create Your Profile
          </button>
          <p className="hero-description" style={{ marginTop: '2rem' }}>
                Want to learn more about the Gimli Saga? You can{' '}
                <a 
                    href="https://gimlisaga.myshopify.com/products/gimli-saga-reprint-of-original-1975" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hero-link"
                >
                    purchase the limited reprint of the original 1975 publication here
                </a>
                !
            </p>


        </div>
        <div className="hero-decoration">
          <img
            src="/border.webp"
            alt="Decorative Viking design"
          />
        </div>
      </section>

      {/* Projects Section */}
      <MeetTeam />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;