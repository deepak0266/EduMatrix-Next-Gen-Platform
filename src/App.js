import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MoodProvider } from './contexts/MoodContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { MusicMoodProvider } from './contexts/MusicMoodContext'; // Import the MusicMoodProvider
import SessionTracker from './components/Session/SessionTracker';
import Header from './components/Common/Header';
import DocumentViewer from './components/Documents/DocumentViewer';
import Chatbot from './components/Chatbot/Chatbot';
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
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MoodProvider>
          <DocumentProvider>
            <ChatbotProvider>
              <MusicMoodProvider>
                <div className="app">
                  <Header />
                  <SessionTracker />
                  <main>
                    <Routes>
                      {/* Public routes without chatbot */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />

                      {/* Protected routes with chatbot */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardPage />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>
                      <Route path="/study" element={
                        <ProtectedRoute>
                          <StudyPage />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>
                      <Route path="/music" element={
                        <ProtectedRoute>
                          <MusicPage />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>
                      <Route path="/games" element={
                        <ProtectedRoute>
                          <GamesPage />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>
                      <Route path="/documents" element={
                        <ProtectedRoute>
                          <DocumentsPage />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>
                      <Route path="/documents/view/:documentId" element={
                        <ProtectedRoute>
                          <DocumentViewer />
                          <Chatbot />
                        </ProtectedRoute>
                      }/>

                      {/* Other protected routes without chatbot */}
                      <Route path="/interview" element={
                        <ProtectedRoute><InterviewPage /></ProtectedRoute>
                      }/>
                      <Route path="/profile" element={
                        <ProtectedRoute><ProfilePage /></ProtectedRoute>
                      }/>
                      <Route path="/settings" element={
                        <ProtectedRoute><SettingsPage /></ProtectedRoute>
                      }/>
                    </Routes>
                  </main>
                </div>
              </MusicMoodProvider>
            </ChatbotProvider>
          </DocumentProvider>
        </MoodProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;