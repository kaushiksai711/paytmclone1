import React, { useState } from "react";
import axios from "axios";

const Transaction = () => {
  const [formData, setFormData] = useState({
    senderUpiId: "",
    receiverUpiId: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/transactions/transfer", formData);
      alert("Transaction successful!");
    } catch (error) {
      alert("Transaction failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Make a Transaction</h2>
      <input type="text" name="senderUpiId" placeholder="Your UPI ID" onChange={handleChange} required />
      <input type="text" name="receiverUpiId" placeholder="Receiver's UPI ID" onChange={handleChange} required />
      <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
      <button type="submit">Send</button>
    </form>
  );
};

export default Transaction;
