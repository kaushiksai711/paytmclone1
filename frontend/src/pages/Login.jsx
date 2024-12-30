import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData.user);
    console.log(userData)
    navigate(`/${userData.user._id}/dashboard`); /// Redirect to username's dashboard
  };

  return (
    <div className="login-page">
      {user ? (
        <div className="welcome-section">
          <h1>Welcome Back, {user.name || 'User'}!</h1>
          <p>You will be redirected to your dashboard shortly.</p>
        </div>
      ) : (
        <div className="form-container">
          <h2>Login to Your Account</h2>
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default Login;
