import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user'); 
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      // data: { user: { _id, username, role }, token }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const { data } = await api.post('/auth/register', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
       console.error("Register failed", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
