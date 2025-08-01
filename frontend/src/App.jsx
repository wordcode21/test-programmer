import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getAuth } from './utils/auth';

const ProtectedRoute = ({ children, roleCheck }) => {
  const { token, role } = getAuth();
  if (!token) return <Navigate to="/login" />;
  if (roleCheck && role !== roleCheck) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleCheck="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleCheck="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<AutoRedirect />} />
      </Routes>
    </Router>
  );
};

const AutoRedirect = () => {
  const navigate = useNavigate();
  const { token, role } = getAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }, [token, role, navigate]);

  return null;
};

export default App;
