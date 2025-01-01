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
    <div>
          <LoginForm onLogin={handleLogin} />
        </div>
  );
};

export default Login;


