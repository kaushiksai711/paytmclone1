import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Transaction from './pages/Transaction';
import AddMoneyPage from './pages/add';
import Dashboard from './components/Dashboard';
import './App.css'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/add" element={<AddMoneyPage/>} />
        <Route path="/:id/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
