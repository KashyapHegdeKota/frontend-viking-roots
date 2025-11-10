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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/questionnaire" element={<VikingRootsQuestionnaire />} />
      <Route path="/gimli-saga" element={<Gimli />} />
      <Route path="/Overview" element={<Overview />} />
      <Route path="/Partner" element={<Partner />} />
      <Route path="/careers" element={<Career />} />
      <Route path="/upload" element={<ImageUpload />} />
      <Route path="/profile/setup" element={<ProfileSetup />} />
      <Route path="/profile/:username" element={<UserProfile />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;
