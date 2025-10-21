import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';
import '../styles/components.css';

interface HomePageProps {
  heroImage?: string; // optional, defaults if not provided
}

const HomePage: React.FC<HomePageProps> = ({ heroImage = '/HeroImageRight.webp' }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }} // dynamically set background
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Ancestry with Viking Roots
          </h1>
          <p className="hero-description">
            The Viking Roots project was created to help people learn about their heritage, 
            understand their bloodlines and lineage, and help reunite families across generations.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} className="hero-button">
              Create Your Profile
            </button>
            <button onClick={() => navigate('/login')} className="hero-button" style={{ backgroundColor: '#76c7c0' }}>
              Login
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <img
            src="/border.webp"
            alt="Decorative Viking design"
          />
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;