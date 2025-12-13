import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(username, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to order delicious sweets</p>
        </div>

        {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Username</label>
            <input 
              type="text" 
              required
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <UserPlus size={20} />
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
