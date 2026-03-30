import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/About';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VikingRootsQuestionnaire from './pages/VikingRootsQuestionnaire';
import OTPVerificationPage from './pages/AuthenticationPage';
import Gimli from './pages/Gimli';
import Overview from './pages/Overview';
import Partner from './pages/Partner';
import Career from './pages/Career';
import ImageUpload from './pages/ImageUpload';
import ProfileSetup from './pages/ProfileSetup';
import UserProfile from './pages/UserProfile';
import HeritageDashboard from './pages/HeritageDashboard';
import GedcomUploader from './pages/GedcomUploader';  
import ManualAncestoryEntry from './pages/ManualAncestoryEntry';
import SocialFeed from './pages/SocialFeed';
import GroupsPage from './pages/GroupsPage';
import AppLayout from './components/AppLayout';

// Wrapper that adds the sidebar + topbar layout
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

function App() {
  return (
    <Routes>
      {/* Public routes - no sidebar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />

      {/* Authenticated routes - with sidebar layout */}
      <Route path="/feed" element={<WithLayout><SocialFeed /></WithLayout>} />
      <Route path="/groups" element={<WithLayout><GroupsPage /></WithLayout>} />
      <Route path="/groups/:groupId" element={<WithLayout><GroupsPage /></WithLayout>} />
      <Route path="/upload" element={<WithLayout><ImageUpload /></WithLayout>} />
      <Route path="/dashboard" element={<WithLayout><HeritageDashboard /></WithLayout>} />
      <Route path="/import-tree" element={<WithLayout><GedcomUploader /></WithLayout>} />
      <Route path="/ancestor/add" element={<WithLayout><ManualAncestoryEntry /></WithLayout>} />
      <Route path="/questionnaire" element={<WithLayout><VikingRootsQuestionnaire /></WithLayout>} />
      <Route path="/profile/setup" element={<WithLayout><ProfileSetup /></WithLayout>} />
      <Route path="/profile/:username" element={<WithLayout><UserProfile /></WithLayout>} />
      <Route path="/profile" element={<WithLayout><UserProfile /></WithLayout>} />
      <Route path="/about" element={<WithLayout><AboutPage /></WithLayout>} />
      <Route path="/gimli-saga" element={<WithLayout><Gimli /></WithLayout>} />
      <Route path="/Overview" element={<WithLayout><Overview /></WithLayout>} />
      <Route path="/Partner" element={<WithLayout><Partner /></WithLayout>} />
      <Route path="/careers" element={<WithLayout><Career /></WithLayout>} />
    </Routes>
  );
}

export default App;
