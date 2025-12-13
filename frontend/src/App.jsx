import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a spinner
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 80px)' }}> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
              <PrivateRoute adminOnly>
                  <AdminPanel />
              </PrivateRoute>
          } />
        </Routes>
      </div>
    </>
  );
}
