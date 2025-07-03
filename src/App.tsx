import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Team from './pages/Team';
import TeamMember from './pages/TeamMember';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Announcements from './pages/Announcements';
import Calendar from './pages/Calendar';
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './components/Admin/AdminDashboard';
import './i18n';

function App() {
  const { i18n } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/team/:id" element={<TeamMember />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;