import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import TransactionHistory from "../components/TransactionHistory";
import { Blockchain } from "../blockchain/BlockChain";

// Initialize blockchain as a singleton
const blockchainInstance = new Blockchain();

const Transactions = () => {
  const location = useLocation();
  const { user } = location.state;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
const [blockchainDetails, setBlockchainDetails] = useState({});

  const [formData, setFormData] = useState({
    senderUpiId: user?.upiId || "",
    receiverUpiId: "",
    amount: "",
    notes: "",
    category: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [receivers, setReceivers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredReceivers, setFilteredReceivers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchReceivers();
  }, []);
  const fetchReceivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/");
      setReceivers(response.data.user.filter((r) => r.upiId !== user.upiId));
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

  // Keep your existing fetch functions and handlers...

  
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
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    setShowModal(true); // Show modal when "Send" button is clicked
  };

  
const handleModalSubmit = async () => {
  try {
    setError("");
    const confirmButton = document.querySelector('button[type="submit"]');
    if (confirmButton) confirmButton.disabled = true;

    // Show loading state

    // Add transaction to blockchain with basic validation
    if (!formData.receiverUpiId || !formData.amount) {
      throw new Error("Please fill in all required fields");
    }

    blockchainInstance.addTransaction({
      senderUpiId: formData.senderUpiId,
      receiverUpiId: formData.receiverUpiId,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
      category: formData.category,
      timestamp: Date.now()
    });

    // Process transaction with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), 5000);
    });

    const miningPromise = blockchainInstance.minePendingTransactions(formData.senderUpiId);
    const minedBlock = await Promise.race([miningPromise, timeoutPromise]);

    // Simple validation to prevent hanging
    if (!minedBlock || !minedBlock.hash) {
      throw new Error('Mining failed, please try again');
    }

    // Proceed with API call
    await axios.post("http://localhost:5000/api/transactions/transfer", {
      ...formData,
      blockchainHash: minedBlock.hash
    });

    alert(`Transaction successful!\nBlock Hash: ${minedBlock.hash.substring(0, 10)}...`);
    
    setFormData({
      senderUpiId: user.upiId,
      receiverUpiId: "",
      amount: "",
      notes: "",
      category: ""
    });
    setSearchTerm("");
    setShowModal(false);
    await fetchTransactions();

  } catch (error) {
    setError(error.message || "Transaction failed. Please try again.");
    console.error(error);
  } finally {
    const confirmButton = document.querySelector('button[type="submit"]');
    if (confirmButton) confirmButton.disabled = false;
  }
};
const viewBlockchainDetails = () => {
  const latestBlock = blockchainInstance.getLatestBlock();
  setBlockchainDetails({
    totalBlocks: blockchainInstance.chain.length,
    latestBlockHash: latestBlock.hash,
    chainValid: blockchainInstance.isChainValid(),
    miningDifficulty: blockchainInstance.difficulty,
  });
  setIsModalOpen(true); // Show the modal
};
  useEffect(() => {
    if (searchTerm) {
      const filtered = receivers.filter(
        (receiver) =>
          receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          receiver.upiId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReceivers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredReceivers([]);
      setShowDropdown(false);
    }
  }, [searchTerm, receivers]);
  // Keep your existing render method but add the blockchain status button
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
      <div className="relative">
  {/* Button */}
  <button
    onClick={viewBlockchainDetails}
    className="fixed top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium shadow-md hover:from-purple-600 hover:via-blue-600 hover:to-purple-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-400 z-50"
  >
    View Blockchain Status
  </button>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-blue-900 p-6 rounded-lg w-96 border border-blue-500 shadow-md">
        <h3 className="text-lg font-bold text-blue-400 mb-4">Blockchain Status</h3>
        <ul className="space-y-2 text-blue-300">
          <li><strong>Total Blocks:</strong> {blockchainDetails.totalBlocks}</li>
          <li><strong>Latest Block Hash:</strong> {blockchainDetails.latestBlockHash}</li>
          <li><strong>Chain Valid:</strong> {blockchainDetails.chainValid.toString()}</li>
          <li><strong>Current Mining Difficulty:</strong> {blockchainDetails.miningDifficulty}</li>
        </ul>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 rounded-lg text-white font-bold px-4 py-2 hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

        <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6 mb-6">
        
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Make a Transaction
            </h2>
            <form onSubmit={handleSendClick} className="space-y-4">
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
                  className="w-full p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 focus:outline-none"
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
                    placeholder="Search by name or UPI"
                    className="w-full p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 focus:outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
                </div>
                {showDropdown && (
                  <div className="absolute z-10 w-full bg-blue-900 rounded-lg mt-1">
                    {filteredReceivers.map((receiver, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-blue-800 cursor-pointer"
                        onClick={() => handleReceiverSelect(receiver)}
                      >
                        <div className="font-medium">{receiver.name}</div>
                        <div className="text-sm text-blue-300">{receiver.upiId}</div>
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
          
        </div>
        
       <TransactionHistory user={user} transactionss={transactions} />
       
       {/* Modal Popup */}
       {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-900 p-6 rounded-lg w-96 border border-blue-500">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Add Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm text-blue-300 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter notes about the transaction"
                  className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm text-blue-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Groceries, Entertainment"
                  className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleModalSubmit}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-bold px-6 py-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 rounded-lg text-white font-bold px-6 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      {/* Rest of your component remains the same */}
    </div>
  );
};

export default Transactions;
