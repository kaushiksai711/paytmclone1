import React, { useState,useEffect } from 'react';
import "./Dashboard.css";
import { useParams } from "react-router-dom";



const Dashboard = () => {
    const { upi } = useParams();
    console.log(upi)
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${upi}`,{
            method: 'GET',
          });
        const data = await response.json();
        console.log(data,'asadadsa')
        setUser(data.user);
        
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
      try {
        const response1 = await fetch(`http://localhost:5000/api/transactions/${upi}`,{
            method: 'GET',
          });
        const data1 = await response1.json();
        console.log(data1,'asdasdass')
        setTransactions(data1.transaction,'transactions')
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
      
    };

    fetchDetails();
  }, [upi]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {console.log(user)}
        <h1>Welcome, {user?.name || "User"}!</h1>
        <p>safe and secure wallet</p>
      </header>
      <div className="dashboard-body">
        <div className="wallet-section">
          <h2>Wallet Balance</h2>
          <div className="wallet-balance">
            ₹{user?.balance?.toLocaleString("en-IN") || "0.00"}
          </div>
        </div>
        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-container">
            <button className="action-button">Add Money</button>
            <button className="action-button">Pay</button>
            <button className="action-button">Request</button>
            <button className="action-button">Send to Bank</button>
          </div>
        </div>

      </div>
      <div className="transactions-section">
  <h2>Recent Transactions</h2>
  {transactions && transactions.length > 0 ? (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Sender UPI</th>
          <th>Receiver UPI</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index} className="transaction-item">
            <td className="transaction-upi">{transaction.senderUpiId}</td>
            <td className="transaction-upi">{transaction.receiverUpiId}</td>
            <td
              className={`transaction-amount ${
                transaction.senderUpiId !== upi ? "credit" : "debit"
              }`}
            >
              {transaction.senderUpiId !== upi ? "+" : "-"}₹
              {transaction.amount.toLocaleString("en-IN")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No recent transactions</p>
  )}
</div>
    </div>
  );
};

export default Dashboard;
