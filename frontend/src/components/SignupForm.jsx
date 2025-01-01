import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate =useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful');
        navigate('/login');

      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Signup failed.');
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm text-blue-300 mb-2">
              Name
            </label>
            <input
              type="string"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-blue-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-blue-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
