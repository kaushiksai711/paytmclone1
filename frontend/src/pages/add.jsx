import React, { useState, useEffect } from "react";
import { PlaidLink } from "react-plaid-link";
import { useLocation ,useNavigate } from 'react-router-dom';
const AddMoneyPage = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const location = useLocation();
    const { user } = location.state;
  const navigate = useNavigate();
  // Fetch link token from the backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/create-link-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);

  const handleOnSuccess = (token, metadata) => {
    console.log("Plaid Link Success:", token, metadata);
    setAccountDetails(metadata.account);
    setIsConnected(true);
  };

  const handleOnExit = (error) => {
    if (error) {
      console.error("Plaid Link Exit Error:", error);
    }
  };

  const saveDetails = () => {
    console.log("Account details saved:", accountDetails);
    alert("Account details saved successfully!");
  };

  const renderBankCard = () => {
    if (!accountDetails) return null;

    const { name, mask, subtype, type } = accountDetails;

    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "400px",
          margin: "20px auto",
          textAlign: "left",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3
          style={{
            color: "#333",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Bank Card
        </h3>
        <p>
          <strong>Name: </strong>
          {name}
        </p>
        <p>
          <strong>Type: </strong>
          {type}
        </p>
        <p>
          <strong>Subtype: </strong>
          {subtype}
        </p>
        <p>
          <strong>Account Mask: </strong>
          **** **** **** {mask}
        </p>
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <button
            onClick={()=>navigate(`/${user._id}/dashboard`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (!linkToken) {
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          margin: "20px",
          textAlign: "center",
        }}
      >
        <h1>Add Money</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        textAlign: "center",
      }}
    >
      <h1>Add Money</h1>
      <span style={{ fontSize: "18px", color: "#555" }}>
        Connect your bank account to add funds securely.
      </span>
      {!isConnected ? (
        <PlaidLink
          token={linkToken}
          onSuccess={handleOnSuccess}
          onExit={handleOnExit}
        >
          <div
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              display: "inline-block",
              marginTop: "20px",
            }}
          >
            Connect Bank Account
          </div>
        </PlaidLink>
      ) : (
        <div>
          <p
            style={{
              fontSize: "16px",
              color: "green",
              marginBottom: "10px",
            }}
          >
            Bank account connected successfully!
          </p>
          <button
            onClick={saveDetails}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            Save Details
          </button>
          {renderBankCard()}
        </div>
      )}
      <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <button
            onClick={()=>navigate(`/${user._id}/dashboard`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
  );
};

export default AddMoneyPage;
