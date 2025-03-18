import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DocumentProvider } from './contexts/DocumentContext';
// import { MoodProvider } from './contexts/MoodContext';

// Import layout components
import Header from './components/Common/Header';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import StudyPage from './pages/StudyPage';
import MusicPage from './pages/MusicPage';
import GamesPage from './pages/GamesPage';
import DocumentsPage from './pages/DocumentsPage';
import InterviewPage from './pages/InterviewPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Import authentication protection
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DocumentProvider>
          
            <div className="app">
              <Header />
              <main>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/study" 
                    element={
                      <ProtectedRoute>
                        <StudyPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/music" 
                    element={
                      <ProtectedRoute>
                        <MusicPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/games" 
                    element={
                      <ProtectedRoute>
                        <GamesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/documents" 
                    element={
                      <ProtectedRoute>
                        <DocumentsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/interview" 
                    element={
                      <ProtectedRoute>
                        <InterviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          
        </DocumentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
