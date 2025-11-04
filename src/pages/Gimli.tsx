import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';
import '../styles/components.css';

interface GimliProps {
  shipImage?: string;
}

const Gimli: React.FC<GimliProps> = ({ shipImage = '/Statue.jpg' }) => {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${shipImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">The Viking Roots Story</h1>
          <p className="hero-description">
            Join the Viking Roots & Gimli Saga Project and become part of a journey started by the trailblazing women of Gimli in 1975. Discover the rich tapestry of Icelandic heritage woven into the community's history, and help trace the remarkable stories and descendants of those who shaped Gimli and Canada. It's time to preserve the past and celebrate the vibrant legacy that continues to thrive today!
          </p>
          <a href="/register" className="hero-button">
            Create Your Profile
          </a>
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
          <img src="/border.webp" alt="Decorative Viking design" />
        </div>
      </section>

      {/* Gimli Saga Info Section */}
      <section className="gimli-section">
        <div className="gimli-container">
          <h2>Gimli Saga Limited Edition Reprint of the 1975 Original</h2>
          <h3>Help Us Update the Gimli Saga for the 150th Anniversary</h3>

          <p>
            The Gimli Saga is more than a book—it’s a treasured record of the people who built the Gimli region. Originally published in 1975 to commemorate the centennial of the Icelandic settlement in New Iceland, the Saga captured the histories of many early families, preserving their names, stories, and contributions for future generations.
          </p>

          <p><strong>But that first edition was just the beginning.</strong></p>

          <h3>A New Chapter Begins — The 150th Anniversary Edition of the Gimli Saga</h3>

          <p>
            In preparation for the 150th anniversary of New Iceland in 2025, we are creating an updated edition of the Gimli Saga—one that reflects the full diversity of the Interlake region. We know that many families were left out of the original book, and we want to ensure that this new edition is as inclusive, accurate, and comprehensive as possible.
          </p>

          <p>This is your chance to be part of history.</p>

          <h3>We Want to Hear From You If:</h3>
          <ul>
            <li>Your family was part of the original Icelandic settlement but was not included in the first edition.</li>
            <li>You are a descendant of settlers from other cultures who helped build the Gimli and Interlake area—Ukrainian, Polish, German, Métis, Indigenous, Scottish, English, and more.</li>
            <li>Your community or organization has a story to share about life in the Interlake—past or present.</li>
            <li>You have photos, documents, or memories passed down through generations that belong in the story of Gimli.</li>
          </ul>

          <h3>Honouring All Histories</h3>
          <p>This new edition of the Gimli Saga will expand beyond the Icelandic story. We welcome and encourage submissions from:</p>

          <ul>
            <li>Indigenous communities who have long called this land home</li>
            <li>Métis families and leaders who played a critical role in shaping this region</li>
            <li>All cultural groups who arrived in later waves of immigration and helped shape Gimli into the vibrant, multicultural town it is today</li>
          </ul>

          <h3>What We’re Collecting:</h3>
          <ul>
            <li>Family histories (short or long)</li>
            <li>Genealogies and family trees</li>
            <li>Photos (especially with names and dates)</li>
            <li>Notable events or contributions</li>
            <li>Stories of immigration, resilience, and community life</li>
          </ul>

          <p>Whether you submit a few paragraphs or a full family story, every voice matters!</p>

          <h3>Let’s Build a Record That Future Generations Deserve</h3>
          <p>
            We owe it to our ancestors—and our children—to preserve these stories with care and respect. The Gimli Saga is not just a book. It’s a time capsule, a legacy, and a gift to the future.
          </p>

          <p><strong>📚 Be part of the 150th chapter. Share your story.<br />Together, let’s make history complete.</strong></p>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      <Footer />
    </div>
  );
};

export default Gimli;
