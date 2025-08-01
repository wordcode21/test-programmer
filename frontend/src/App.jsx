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
        <Route
          path="/barang/:kode_barang"
          element={
            <ProtectedRoute roleCheck="user">
              <Barang />
            </ProtectedRoute>
          }
        />
        <Route
          path="/barang-admin/:kode_barang"
          element={
            <ProtectedRoute roleCheck="admin">
              <BarangAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-barang/:kode_barang"
          element={
            <ProtectedRoute roleCheck="admin">
              <UpdateBarang/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tambah-barang"
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
