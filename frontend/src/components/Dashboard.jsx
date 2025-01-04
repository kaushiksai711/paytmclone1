
import React, { useState, useEffect } from 'react';
import { Activity, Wallet, SendHorizontal, Download, Upload, CreditCard, Loader2, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  // ... previous state declarations ...
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Format transactions for the graph
  const prepareGraphData = (transactions, userUpiId) => {
    const dateMap = new Map();
    const reversedTransactions = [...transactions].reverse()
    reversedTransactions.forEach(tx => {
      const date = new Date(tx.timestamp || Date.now()).toLocaleDateString();
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, received: 0, spent: 0 });
      }
      
      const entry = dateMap.get(date);
      if (tx.receiverUpiId === userUpiId) {
        entry.received += tx.amount;
      } else {
        entry.spent += tx.amount;
      }
    });

    return Array.from(dateMap.values());
  };
  useEffect(() => {
         const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
         return () => clearInterval(clockTimer);
       }, []);
    
  // ... previous useEffect hooks ...
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        
        if (!data || !data.user) {
          throw new Error("User not found");
        }
        
        setUser(data.user);
        
        const response1 = await fetch(`http://localhost:5000/api/transactions/${data.user.upiId}`, {
          method: 'GET',
        });
        const data1 = await response1.json();
        
        if (!Array.isArray(data1)) {
          throw new Error("Invalid transaction data");
        }
        const recentElements = data1.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0,2)
        setTransactions(data1 );
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const formatTime = (date) => {
         return date.toLocaleTimeString('en-US', { 
           hour12: false,
           hour: '2-digit',
           minute: '2-digit',
           second: '2-digit'
         });
       };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }




  const graphData = prepareGraphData(transactions, user?.upiId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white">
      {/* Previous header section ... */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome, {user?.name || "User"}!
          </h1>
          <p className="text-blue-300 mt-2">Safe and secure wallet</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-blue-300">{formatTime(currentTime)}</div>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm border border-blue-400/30 text-blue-400">
            System Online
          </span>
        </div>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Previous three cards ... */}
          {/* Balance Card */}
          <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Wallet className="mr-2 text-blue-400" />
            <h2 className="text-xl font-bold">Wallet Balance</h2>
          </div>
          <div className="text-4xl font-bold text-blue-400 mb-6">
            ₹{user?.balance?.toLocaleString("en-IN") || "0.00"}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <Download className="inline-block mb-1" />
              <div>Income</div>
              <div className="text-sm text-blue-300">
                ₹{transactions
                  .filter(t => t.receiverUpiId === user?.upiId)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg backdrop-blur-sm">
              <Upload className="inline-block mb-1" />
              <div>Spent</div>
              <div className="text-sm text-purple-300">
                ₹{transactions
                  .filter(t => t.senderUpiId === user?.upiId)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 text-blue-400" />
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Download />, label: 'Add Money', path: '/add' },
              { icon: <SendHorizontal />, label: 'Pay' , path: '/transaction'},
              { icon: <Upload />, label: 'Request' , path: '/Request'},
              { icon: <CreditCard />, label: 'Send to Bank', path: '/Send' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-sm flex flex-col items-center gap-2"
                onClick={() => navigate(action.path,{state:{user}})}
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 text-blue-400" />
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {transactions.slice(0,2).map((transaction, index) => (
                <div 
                  key={index}
                  className="p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm truncate max-w-[200px]">
                      {transaction.senderUpiId}
                    </div>
                    <span 
                      className={`px-2 py-1 rounded-full text-sm border ${
                        user?.upiId !== transaction.senderUpiId 
                          ? "text-green-400 border-green-400/30" 
                          : "text-red-400 border-red-400/30"
                      }`}
                    >
                      {user?.upiId !== transaction.senderUpiId ? "+" : "-"}₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 mt-1 truncate">
                    To: {transaction.receiverUpiId}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-blue-300">
              No recent transactions
            </div>
          )}
        </div>
      </div>

      {/* New Graph and Account Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Transaction Graph */}
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 text-blue-400" />
            <h2 className="text-xl font-bold">Transaction Analysis</h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="received" 
                  stroke="#4ade80" 
                  name="Money Received"
                  strokeWidth={2}
                  dot={{ fill: '#4ade80' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="#f87171" 
                  name="Money Spent"
                  strokeWidth={2}
                  dot={{ fill: '#f87171' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <User className="mr-2 text-blue-400" />
            <h2 className="text-xl font-bold">Account Details</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-blue-300">Account Name</div>
              <div className="text-lg">{user?.name}</div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-blue-300">UPI ID</div>
              <div className="text-lg">{user?.upiId}</div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-blue-300">Account Status</div>
              <div className="text-lg flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Active
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-blue-300">Last Login</div>
              <div className="text-lg">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-blue-300">Transaction Limit</div>
              <div className="text-lg">₹1,00,000 per day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
