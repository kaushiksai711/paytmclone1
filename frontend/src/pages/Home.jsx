import React, { useEffect, useState } from 'react';
import { Wallet, Shield, Zap, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      {/* Header Section */}
      <div className="absolute top-4 right-6 text-right">
        <div className="text-2xl font-mono text-blue-300">{formatTime(currentTime)}</div>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm border border-blue-400/30 text-blue-400">
          System Online
        </span>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Next-Gen Digital Payments
          </h1>
          <p className="text-blue-300 text-xl mb-12 max-w-2xl mx-auto">
            Experience seamless transactions with cutting-edge security and lightning-fast processing
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: <Wallet className="h-8 w-8" />,
              title: "Smart Wallet",
              description: "Manage your finances with our intelligent digital wallet"
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Secure Payments",
              description: "Bank-grade encryption for all your transactions"
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Instant Transfer",
              description: "Send money anywhere instantly with zero delays"
            },
            {
              icon: <RefreshCw className="h-8 w-8" />,
              title: "Real-time Updates",
              description: "Track your transactions with live notifications"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6 hover:bg-blue-500/5 transition-all duration-300"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: "10M+", label: "Active Users" },
            { value: "₹100B+", label: "Transactions" },
            { value: "99.99%", label: "Uptime" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-blue-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <button className="px-8 py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded-lg text-blue-400 font-bold transition-all duration-300 backdrop-blur-sm" onClick={()=>navigate('/login')}>
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;