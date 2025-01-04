import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone,setPhone]=useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsOtpSent(true);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsOtpVerified(true);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white flex items-center justify-center">
      <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome
          </h1>
          <p className="text-blue-300 mt-2">Login to your account</p>
        </div>

        <form className="space-y-6">
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

          {!isOtpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Send OTP
            </button>
          ) : !isOtpVerified ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm text-blue-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
            <label htmlFor="Phone" className="block text-sm text-blue-300 mb-2">
              Phone
            </label>
            <input
              type="string"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
              placeholder="Enter your Phone"
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
              <button
                onClick={handleLogin}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Login
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
        </form>

        <div className="text-center mt-6 text-blue-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;