import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token } = res.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      localStorage.setItem('userId', userId);

      navigate('/home');
    } catch (err) {
      alert('Login failed');
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow border-0 p-4" style={{ maxWidth: '350px', width: '100%', height: '450px' }}>
        <div className="card-body d-flex flex-column justify-content-center">
          <h3 className="text-center mb-4 text-dark">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Password"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-dark btn-lg">
                Login
              </button>
            </div>
            <p className="mt-3 text-center text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-bold text-dark">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
