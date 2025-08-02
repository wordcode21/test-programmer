import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Barang from './pages/Barang';
import BarangAdmin from './pages/BarangAdmin';
import TambahBarang from './pages/TambahBarang';
import UpdateBarang from './pages/UpdateBarang';
import { getAuth } from './utils/auth';

const ProtectedRoute = ({ children, roleCheck }) => {
  const { token, role } = getAuth();
  if (!token) return <Navigate to="/test-programmer/login" />;
  if (roleCheck && role !== roleCheck) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test-programmer/login" element={<Login />} />
        <Route
          path="/test-programmer/dashboard"
          element={
            <ProtectedRoute roleCheck="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-programmer/admin"
          element={
            <ProtectedRoute roleCheck="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-programmer/barang/:kode_barang"
          element={
            <ProtectedRoute roleCheck="user">
              <Barang />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-programmer/barang-admin/:kode_barang"
          element={
            <ProtectedRoute roleCheck="admin">
              <BarangAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-programmer/update-barang/:kode_barang"
          element={
            <ProtectedRoute roleCheck="admin">
              <UpdateBarang/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-programmer/tambah-barang"
          element={
            <ProtectedRoute roleCheck="admin">
              <TambahBarang/>
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
      navigate('/test-programmer/login');
    } else if (role === 'admin') {
      navigate('/test-programmer/admin');
    } else {
      navigate('/test-programmer/dashboard');
    }
  }, [token, role, navigate]);

  return null;
};

export default App;
