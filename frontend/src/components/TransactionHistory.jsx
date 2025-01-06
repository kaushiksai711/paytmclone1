import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const TransactionHistory = ({ user, transactionss }) => {
  const [transactions, setTransactions] = useState(transactionss || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!transactionss || transactionss.length === 0) {
      fetchTransactions();
    } else {
      setTransactions(
        transactionss.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    }
  }, [transactionss]);

  const fetchTransactions = async () => {
    if (!user?.upiId) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/${user.upiId}`);
      const sortedTransactions = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTransactions(sortedTransactions);
      setError(null);
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const exportToCSV = () => {
    const csvContent = transactions.map(transaction =>
      [
        `"${transaction.amount}"`,
        `"${transaction.receiverUpiId}"`,
        `"${transaction.category || "Uncategorized"}"`,
        `"${transaction.notes || "No notes"}"`,
        `"${format(new Date(transaction.timestamp), "dd-MMM-yyyy, h:mm a")}"`,
      ].join(",")
    );
    const csvBlob = new Blob(
      [`Amount,Receiver,Category,Notes,Date\n${csvContent.join("\n")}`],
      { type: "text/csv" }
    );
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = "transactions.csv";
    downloadLink.click();
  };

  const categoryColors = {
    Food: "bg-green-400",
    Shopping: "bg-yellow-400",
    Bills: "bg-red-400",
    Travel: "bg-blue-400",
    Uncategorized: "bg-gray-400",
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Transaction History
        </h2>

        {loading ? (
          <div className="text-center text-blue-300">Loading transactions...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-blue-300">No transactions available.</div>
        ) : (
          <>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
            >
              Download CSV
            </button>
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-lg p-6 hover:shadow-md hover:shadow-blue-500/30 transition-shadow"
              >
                <div
                  className="flex justify-between items-center p-3 border rounded-lg hover:shadow-lg transition-shadow"
                  style={{
                    background: "linear-gradient(145deg, #1e2433, #252d42)",
                    boxShadow: "4px 4px 10px #0f131e, -4px -4px 10px #323b55",
                    border: "1px solid #3a4566",
                  }}
                  onClick={() => toggleExpand(index)}
                >
                  <div>
                    <p
                      className={`px-3 py-1 text-sm font-medium rounded-full border shadow-sm ${
                        user?.upiId !== transaction.senderUpiId
                          ? "text-green-300 border-green-400"
                          : "text-red-300 border-red-400"
                      }`}
                      style={{
                        backgroundColor:
                          user?.upiId !== transaction.senderUpiId ? "#203D2E" : "#3D2020",
                        display: "inline-block",
                        marginBottom: "5px",
                      }}
                    >
                      {user?.upiId !== transaction.senderUpiId ? "+" : "-"}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-blue-400">
                      {user?.upiId !== transaction.senderUpiId
                        ? `Received from: ${transaction.senderUpiId}`
                        : `Paid to: ${transaction.receiverUpiId}`}
                    </p>
                    <p className="text-xs text-blue-300">
                      {format(new Date(transaction.timestamp), "dd-MMM-yyyy, h:mm a")}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      categoryColors[transaction.category] || categoryColors["Uncategorized"]
                    }`}
                  >
                    {transaction.category || "Uncategorized"}
                  </div>
                </div>

                {expanded === index && (
                  <div className="mt-4 border-t border-blue-500/20 pt-4">
                    <p className="text-sm text-blue-300 font-semibold">Notes</p>
                    <p className="text-sm text-blue-400">
                      {transaction.notes || "No additional notes provided."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
