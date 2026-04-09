import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import SocialFeed from "./pages/SocialFeed";
import GroupsPage from "./pages/GroupsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import UserProfile from "./pages/UserProfile";
import VikingRootsQuestionnaire from "./pages/VikingRootsQuestionnaire";
import About from "./pages/About";
import Gimli from "./pages/Gimli";
import Overview from "./pages/Overview";
import ProfileSetup from "./pages/Profile";
import HeritageDashboard from "./pages/HeritageDashboard";
import ManualAncestoryEntry from "./pages/ManualAncestoryEntry";
import UploadPage from "./pages/UploadPage";
import FamilyTree from "./pages/FamilyTree";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/feed" element={<SocialFeed />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/groups/:groupId" element={<GroupsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp-verify" element={<AuthenticationPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/:username" element={<UserProfile />} />
      <Route path="/questionnaire" element={<VikingRootsQuestionnaire />} />
      <Route path="/about" element={<About />} />
      <Route path="/gimli" element={<Gimli />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/profile/setup" element={<ProfileSetup />} />
      <Route path="/heritage-dashboard" element={<HeritageDashboard />} />
      <Route path="/ancestor/add" element={<ManualAncestoryEntry />} />
      <Route path="/dashboard/upload" element={<UploadPage />} />
      <Route path="/familytree" element={<FamilyTree />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
