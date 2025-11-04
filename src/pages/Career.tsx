import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsSection from '../components/ProjectSection';
import '../styles/components.css';

interface CareerProps {
  heroImage?: string;
}

const Career: React.FC<CareerProps> = ({ heroImage = '/HeroImageRight.webp' }) => {
  const jobs = [
    {
      title: 'High School Volunteers',
      location: 'Remote',
      description:
        'Calling all high school students! Dive into history and make a tangible impact by volunteering with the Gimli Saga digitization project. Not only will you earn valuable volunteer hours, but you’ll also play a crucial role in preserving the Icelandic heritage of Gimli. By typing family information into our database, you’ll help ensure that future generations can connect with their roots and understand the rich cultural tapestry of our community. Join us in transforming history into a digital legacy that will inspire and educate for years to come!',
    },
    {
      title: 'Genealogists',
      location: 'Remote',
      description:
        'Attention volunteer genealogists! Join our mission with the Gimli Saga project and use your expertise to digitize and document the ancestral histories of Gimli’s immigrants from all regions. By lending your skills to our database effort, you’ll contribute directly to preserving and celebrating our community’s heritage. Together, let’s ensure that the stories and lineage of our ancestors continue to inspire and educate generations to come. Join us in this meaningful journey of discovery and preservation today!',
    },
    {
      title: 'Icelandic Translator',
      location: 'Remote',
      description:
        'Are you passionate about genealogy and Icelandic history? Your expertise in translating historical documents and family records will ensure that these valuable resources are accessible to everyone, both locally and internationally. Together, we can bridge language barriers and celebrate the cultural legacy of our ancestors. Join us in bringing history to life through language and making a lasting impact on our community!',
    },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Join Our Team</h1>
          <p className="hero-description">
            Discover exciting career opportunities at Viking Roots ©
          </p>
        </div>
        <div className="hero-decoration">
          <img src="/border.webp" alt="Decorative Viking design" />
        </div>
      </section>

      {/* Job Grid Section */}
      <section className="job-grid-container">
        <h2 className="job-grid-title">Current Opportunities</h2>
        <div className="job-grid">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-location">Location: {job.location}</p>
              <p className="job-description">{job.description}</p>
              <a
                href="https://www.linkedin.com/company/vikingroots/"
                target="_blank"
                rel="noopener noreferrer"
                className="apply-button"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      <Footer />
    </div>
  );
};

export default Career;
