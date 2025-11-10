import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';
import '../styles/components.css';

interface OverviewProps {
  mainImage?: string;
}

const Overview: React.FC<OverviewProps> = ({ mainImage = '/Donate.jpg' }) => {
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
            Phase I is a culmination of over 20 years of work, providing a meeting
            place for like-minded individuals who would like to track and contribute
            to the memorialization of their heritage. Phase II is a formal digital
            museum with interactive features, family trees, and cooperative features
            where you can store your historic family images and collaborate with
            family members. The second phase will further connect families together
            online with a more detailed profile area, additional website content, and
            the goal of creating a more community-centred platform for sharing. The
            timeline of this second phase is still in progress, however, our goal of
            discovering the lineage of families and connecting people together will
            remain at the forefront of everything we do.
          </p>
          <a href="/register" className="hero-button">
            Create Your Profile
          </a>
        </div>
        <div className="hero-decoration">
          <img src="/border.webp" alt="Decorative Viking design" />
        </div>
      </section>

      {/* Overview Info Section */}
      <section className="overview-section">
        <div className="overview-container">
          <h2>Viking Roots: Connecting Families Together</h2>
          <h3>How To Get Started With Viking Roots</h3>

          <p>
            When you create a profile, you can start answering questions that will provide
            a better idea of your family lineage & history. From here, that data can connect
            you with others who share the same background with the goal of uniting families
            and filling the gaps in your family history.
          </p>

          <p>
            If you're ready to discover more about your family history, create a profile{' '}
            <a href="/register">here</a> to get started!
          </p>

          <p>
            The purpose of the Viking Roots project is to unite families by connecting the
            dots throughout each unique journey in life. Families often have a unique, rich
            history that originates from their ancestors. How they arrived in the city they
            currently live in is a story worth sharing. Understanding more of what life was
            like before their upbringing is something many people seek to understand. Learning
            more about one's parents, their parents’ parents, and the generations well before
            them can uncover so much wonderful information while also creating a way to connect
            people.
          </p>

          <p>
            The Viking Roots project is about just that — discovery and connectivity of families
            together through the very roots that tell the story of one’s lineage. This project
            is about creating a place online where family members can answer questions, fill in
            gaps, and discover more about their own history than they thought possible through
            the power of digital connections and communication. In its essence, this project will
            allow people from across Canada, North America, and the World to learn more about their
            ancestors, their heritage, and the stories that define their family long before their
            time and will continue long after.
          </p>

          <p>
            <strong>Ready to get started?</strong>{' '}
            <a href="/register">Create your profile here!</a>
          </p>
        </div>
      </section>

      <ProjectsSection />
      <Footer />
    </div>
  );
};

export default Overview;
