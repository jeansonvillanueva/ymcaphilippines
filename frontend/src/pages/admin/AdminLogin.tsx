import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import Footer from '../../components/Footer';
import logo from '../../assets/images/logo.webp';
import './AdminLogin.css';

const LOGIN_URL = `${ADMIN_API_URL}/login`;
const STATUS_URL = `${ADMIN_API_URL}/status`;

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await axios.get(STATUS_URL);
        if (!mounted) return;

        if (response.data?.authenticated) {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (err) {
        // No action; user stays on login form
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.authenticated) {
        navigate('/admin/dashboard');
      } else {
        setError(response.data?.error || 'Invalid username or password');
        setPassword('');
      }
    } catch (err) {
      const axiosError = err as any;
      const serverError = axiosError?.response?.data?.error;
      const status = axiosError?.response?.status;

      if (serverError) {
        setError(serverError);
      } else if (status === 503) {
        setError('Server unavailable. Please try again later.');
      } else {
        setError('Invalid username or password');
      }

      setPassword('');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-content">
          <div className="admin-login-logo">
            <img src={logo} alt="YMCA Logo" />
          </div>
          
          <h1 className="admin-login-title">Admin</h1>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && <div className="admin-login-error">{error}</div>}
            
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-login-input"
              disabled={isLoading}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              className="admin-login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
