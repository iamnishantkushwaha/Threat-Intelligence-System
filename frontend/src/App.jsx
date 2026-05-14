import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Agents from './pages/Agents';
import Threats from './pages/Threats';
import Malware from './pages/Malware';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Register from './pages/Register';
import Settings from './pages/Settings';
import EmailAnalyzer from './pages/EmailAnalyzer';
import BreachChecker from './pages/BreachChecker';
import ThreatIntel from './pages/ThreatIntel';
import { WebSocketProvider } from './components/WebSocketProvider';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <WebSocketProvider>
      <Layout>{children}</Layout>
    </WebSocketProvider>
  );
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
          <Route path="/threats" element={<ProtectedRoute><Threats /></ProtectedRoute>} />
          <Route path="/malware" element={<ProtectedRoute><Malware /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/email-analyzer" element={<ProtectedRoute><EmailAnalyzer /></ProtectedRoute>} />
          <Route path="/breach-checker" element={<ProtectedRoute><BreachChecker /></ProtectedRoute>} />
          <Route path="/threat-intel" element={<ProtectedRoute><ThreatIntel /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
