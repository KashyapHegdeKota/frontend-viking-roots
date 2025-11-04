import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';
import '../styles/components.css';

interface PartnerProps {
  mainImage?: string;
}

const Partner: React.FC<PartnerProps> = ({ mainImage = '/BgImage.jpg' }) => {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${mainImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content hero-contained">
          <h1 className="hero-title">Discover Viking Roots</h1>
          <p className="hero-description">
            Discover the reprint of the 1975 Gimli Saga available at several retailers. 
          </p>
          <a href="https://gimlisaga.myshopify.com/products/gimli-saga-reprint-of-original-1975" className="hero-button">
            Get your copy here today!
          </a>
        </div>
        <div className="hero-decoration">
          <img src="/border.webp" alt="Decorative Viking design" />
        </div>
      </section>

      {/* Partner Info Section */}
      <section className="Partner-section">
        <div className="Partner-container">
          <h2>Learn More About the Viking Roots Project & Gimli Saga</h2>
          

          
        </div>
      </section>

      <ProjectsSection />
      <Footer />
    </div>
  );
};

export default Partner;
