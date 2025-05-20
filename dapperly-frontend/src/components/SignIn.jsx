// src/components/SignInPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../css/SignIn.css';
import axios from 'axios';

const SignInPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('User');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'https://dapperly-bpcbh3erbzc4ckhh.eastasia-01.azurewebsites.net';
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/login/api/Auth/login`, {
        emailid: username,
        password,
      });
      const data= response.data;
      console.log(data);
      if (data) {
        login(data);
        navigate('/products');
      } else {
        alert('No token received');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Invalid credentials');
      } else {
        alert(error.message);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/login/api/Auth/register`, {
        company,
        emailid: username,
        password,
        role
      });
      alert('Registration successful. Please log in.');
      setIsRegistering(false); // go back to login
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Registration failed');
      } else {
        alert(error.message);
      }
    }
  };

return (
  <div className="signin-container">
    <h2 className="signin-title">{isRegistering ? 'Register' : 'Sign In'}</h2>
    <form onSubmit={isRegistering ? handleRegister : handleLogin} className="signin-form">
      {isRegistering && (
        <>
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="signin-input"
          />

          {/* Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="signin-input"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="signin-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="signin-input"
      />
      <button type="submit" className="signin-button">
        {isRegistering ? 'Register' : 'Sign In'}
      </button>
    </form>

    <div className="toggle-link">
      {isRegistering ? (
        <p>
          Already have an account?{' '}
          <span onClick={() => setIsRegistering(false)} className="link">
            Sign In
          </span>
        </p>
      ) : (
        <p>
          Don’t have an account?{' '}
          <span onClick={() => setIsRegistering(true)} className="link">
            Register
          </span>
        </p>
      )}
    </div>
  </div>
);

};

export default SignInPage;
