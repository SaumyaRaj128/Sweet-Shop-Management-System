import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, User, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ 
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
          <ShoppingBag size={28} />
          <span>SweetDelights</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <Link to="/" className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }}>
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }}>
                  <PlusCircle size={20} />
                  Admin Panel
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                <User size={20} className="text-muted" />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
