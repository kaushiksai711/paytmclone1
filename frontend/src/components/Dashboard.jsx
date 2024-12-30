import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch user details
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        
        if (!data || !data.user) {
          throw new Error("User not found");
        }

        console.log(data, data.user.upiId, 'Fetched user');
        setUser(data.user);

        // Fetch transactions based on the user's UPI ID
        const response1 = await fetch(`http://localhost:5000/api/transactions/${data.user.upiId}`, {
          method: 'GET',
        });
        const data1 = await response1.json();

        if (!Array.isArray(data1)) {
          throw new Error("Invalid transaction data");
        }

        console.log(data1, 'Fetched transactions');
        setTransactions(data1);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || "User"}!</h1>
        <p>Safe and secure wallet</p>
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
                      user?.upiId !== transaction.senderUpiId ? "credit" : "debit"
                    }`}
                  >
                    {user?.upiId !== transaction.senderUpiId ? "+" : "-"}₹
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
