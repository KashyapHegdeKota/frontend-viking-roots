import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import GroupsPage from "./pages/GroupsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import UserProfile from "./pages/UserProfile";
import AIInterview from "./pages/AI-Interview";
import About from "./pages/About";
import Gimli from "./pages/Gimli";
import Overview from "./pages/Overview";
import ProfileSetup from "./pages/Profile";
import HeritageDashboard from "./pages/HeritageDashboard";
import ManualAncestoryEntry from "./pages/ManualAncestoryEntry";
import UploadPage from "./pages/UploadPage";
import FamilyTree from "./pages/FamilyTree";
import SettingsPage from "./pages/SettingsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import { Layout} from "@/components/Layout";
import { DashboardSidebarLayout } from "@/components/DashboardSidebarLayout"; // You'll need to create this

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC / GENERAL LAYOUT (Only Navbar) */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/gimli" element={<Gimli />} />
        <Route path="/overview" element={<Overview />} />
        
        {/* Auth / Focus Pages (Navbar only, or move completely outside Layout if you want no navbar) */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp-verify" element={<AuthenticationPage />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/ai-interview" element={<AIInterview />} />
      </Route>

      {/* 2. APP / DASHBOARD LAYOUT (Navbar + Sidebar) */}
        <Route element={<DashboardSidebarLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/upload" element={<UploadPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/heritage-dashboard" element={<HeritageDashboard />} />
          <Route path="/ancestor/add" element={<ManualAncestoryEntry />} /> // TODO: This is currenlty inaccessible and the page also needs modifications 
          <Route path="/familytree" element={<FamilyTree />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

      {/* 3. COMPLETELY BARE LAYOUT (No Navbar, No Sidebar) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;