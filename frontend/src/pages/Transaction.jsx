// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation } from 'react-router-dom';
// const Transactions = () => {
//   const location = useLocation();
//   const { user } = location.state ;

//   const [formData, setFormData] = useState({
//     senderUpiId: "",
//     receiverUpiId: "",
//     amount: "",
//   });
//   const [transactions, setTransactions] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchTransactions();
//   }, []);
//  //errorrr in response line upi req
//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/transactions/${user.upiId}`);
//       setTransactions(response.data);
//     } catch (error) {
//       console.error("Failed to fetch transactions:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData,
//       senderUpiId: user?.upiId,[e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/transactions/transfer", formData);
//       alert("Transaction successful!");
//       setFormData({ senderUpiId: "", receiverUpiId: "", amount: "" }); // Clear form
//       fetchTransactions(); // Refresh transaction history
//     } catch (error) {
//       setError("Transaction failed. Please try again.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white">
//       <div className="max-w-4xl mx-auto">
//         {/* Transaction Form */}
//         <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6 mb-6">
//           <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
//             Make a Transaction
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label htmlFor="senderUpiId" className="block text-sm text-blue-300 mb-2">
//                   Your UPI ID
//                 </label>
//                 <input
//                   type="text"
//                   name="senderUpiId"
//                   value={user.upiId}
//                   className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label htmlFor="receiverUpiId" className="block text-sm text-blue-300 mb-2">
//                   Receiver's UPI ID
//                 </label>
//                 <input
//                   type="text"
//                   name="receiverUpiId"
//                   value={formData.receiverUpiId}
//                   onChange={handleChange}
//                   placeholder="Receiver's UPI ID"
//                   className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="amount" className="block text-sm text-blue-300 mb-2">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   placeholder="Amount"
//                   className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
//                   required
//                 />
//               </div>
//             </div>
//             {error && <div className="text-red-400 text-sm">{error}</div>}
//             <button
//               type="submit"
//               className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
//             >
//               Send
//             </button>
//           </form>
//         </div>

//         {/* Transaction History */}
//         <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
//           <h2 className="text-2xl font-bold bg-clip-text text -transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 ">
//             Transaction History
//           </h2>
//           {transactions.length > 0 ? (
//             <div className="space-y-4 max-h-[400px] overflow-y-auto">
//               {transactions.sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp)).map((transaction, index) => (
//                 <div
//                   key={index}
//                   className="p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div className="text-am max-w-[300px]">
//                       {transaction.senderUpiId} to <br/>{transaction.receiverUpiId}
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded-full text-sm border ${
//                         transaction.senderUpiId === user.upiId
//                           ? "text-green-400 border-green-400/30"
//                           : "text-red-400 border-red-400/30"
//                       }`}
//                     >
//                       {transaction.senderUpiId === user.upiId ? "+" : "-"}₹
//                       {transaction.amount.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="text-xs text-blue-300 mt-1 truncate">
//                     Date: {new Date(transaction.timestamp).toLocaleString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-6 text-blue-300">
//               No transaction history available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transactions;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation ,useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Dashboard from "../components/Dashboard";

const Transactions = () => {
  const location = useLocation();
  const { user } = location.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderUpiId: "",
    receiverUpiId: "",
    amount: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [receivers, setReceivers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredReceivers, setFilteredReceivers] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchReceivers();
  }, []);

  const fetchReceivers = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get("http://localhost:5000/api/users/");
      console.log(response)
      setReceivers(response.data.user.filter(r => r.upiId !== user.upiId));
    } catch (error) {
      console.error("Failed to fetch receivers:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/${user.upiId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = receivers.filter(receiver => 
        receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //receiver.phone.includes(searchTerm) ||
        receiver.upiId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReceivers(filtered);
      console.log(filtered)
      setShowDropdown(true);
    } else {
      setFilteredReceivers([]);
      setShowDropdown(false);
    }
  }, [searchTerm, receivers]);

  const handleReceiverSelect = (receiver) => {
    setFormData({
      ...formData,
      receiverUpiId: receiver.upiId,
    });
    setSearchTerm(receiver.name);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "searchReceiver") {
      setSearchTerm(e.target.value);
    } else {
      setFormData({
        ...formData,
        senderUpiId: user?.upiId,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/transactions/transfer", formData);
      alert("Transaction successful!");
      setFormData({ senderUpiId: user.upiId, receiverUpiId: "", amount: "" });
      setSearchTerm("");
      fetchTransactions();
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Make a Transaction
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
            <div>
                <label htmlFor="amount" className="block text-sm text-blue-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              <div className="relative">
                <label htmlFor="searchReceiver" className="block text-sm text-blue-300 mb-2">
                  Search Receiver
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="searchReceiver"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search by name, phone, or UPI ID"
                    className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none focus:border-blue-500/50"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                </div>
                {showDropdown && filteredReceivers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-blue-900/90 backdrop-blur-lg border border-blue-500/20 rounded-lg max-h-48 overflow-y-auto">
                    {filteredReceivers.map((receiver, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-blue-800/50 cursor-pointer"
                        onClick={() => handleReceiverSelect(receiver)}
                      >
                        <div className="font-medium">{receiver.name}</div>
                        <div className="text-sm text-blue-300">{receiver.phone}</div>
                        <div className="text-xs text-blue-400">{receiver.upiId}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="flex">
            <button
              type="submit"
              className="w-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Send
            </button>
            <button
              onClick={()=>navigate(`/${user._id}/dashboard`)}
              className="w-1/2 p-3  ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              return to DashBoard
            </button>
            </div>
          </form>
        </div>

        {/* Transaction History section remains the same */}
        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Transaction History
          </h2>
          {transactions.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {transactions.sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp)).map((transaction, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm max-w-[300px]">
                      {transaction.senderUpiId} to <br/>{transaction.receiverUpiId}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm border ${
                        transaction.senderUpiId !== user.upiId
                          ? "text-green-400 border-green-400/30"
                          : "text-red-400 border-red-400/30"
                      }`}
                    >
                      {transaction.senderUpiId !== user.upiId ? "+" : "-"}₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-xs text-blue-300 mt-1 truncate">
                    Date: {new Date(transaction.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-blue-300">
              No transaction history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;