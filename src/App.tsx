import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VikingRootsQuestionnaire from './pages/VikingRootsQuestionnaire';
function App() {
  const navigate = useNavigate();

  // Automatically redirect root path "/" to "/login"
  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/questionnaire" element={<VikingRootsQuestionnaire />} />
    </Routes>
  );
}

export default App;
