
const User = require("../models/User");
const crypto = require("crypto");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// Convert the id parameter to ObjectId
const axios = require("axios");

// Helper function to generate unique UPI IDs
const generateUPI = () => crypto.randomBytes(8).toString("hex") + "@paytmclone";

exports.signup = async (req, res) => {
    const { name, email,phone, password } = req.body;
    const upiId = generateUPI();

    try {
        const newUser = new User({ name, email, password, upiId, balance: 0,phoneno:phone });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", upiId });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", details: error });
    }
};

exports.login = async (req, res) => {
    const { email,phone, password } = req.body;

    try {
        const user = await User.findOne({ email, password ,phone});
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error });
    }
};
exports.details=async (req, res) => {
    const { id } = (req.params);
        //example id :'6769b91294d30fdadae3bf7e'
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId)
    try {
        /*trying with object id _id  */
        const { id } = (req.params);
        //example id :'6769b91294d30fdadae3bf7e'
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId)
        const user = await User.findById(objectId);
        console.log(user)
        
    console.log(req)
        if (user) {
            res.status(200).json({ user });
        } 
        else{
            res.status(404).json({ error: "User not found" });
            }
    } catch (error) {
        res.status(500).json( 'error' );
    }
  };
  exports.alldetails=async (req, res) => {
    try {
        const user = await User.find({}, { name: 1, upiId: 1, _id: 0 });
        
    console.log(req)
        if (user) {
            res.status(200).json({ user });
        } 
        else{
            res.status(404).json({ error: "User not found" });
            }
    } catch (error) {
        res.status(500).json( 'error' );
    }
  };
// Temporary in-memory OTP store (replace with Redis/DB in production)
const otpStore = {};

// Controller to send OTP
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Valid for 5 minutes

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.SMTP_EMAIL, // Your email
            pass: process.env.SMTP_PASSWORD, // App-specific password
        },
    });

    // Send the OTP
    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        });

        return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

// Controller to verify OTP
exports.verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).json({ message: 'OTP not requested or expired.' });
    }

    const { otp: storedOtp, expiresAt } = otpStore[email];

    if (Date.now() > expiresAt) {
        delete otpStore[email]; // Remove expired OTP
        return res.status(400).json({ message: 'OTP has expired.' });
    }

    if (parseInt(otp) === storedOtp) {
        delete otpStore[email]; // OTP is used and no longer needed
        return res.status(200).json({ message: 'OTP verified successfully!' });
    }

    return res.status(400).json({ message: 'Invalid OTP.' });
};
 // Change to "development" or "production" as needed

exports.createLinkToken = async (req, res) => {
  try {
    const response = await axios.post(
      `https://${process.env.PLAID_ENV}.plaid.com/link/token/create`,
      {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        user: {
          client_user_id: "user-id-123", // Replace with an actual user identifier
        },
        client_name: "Your App Name",
        products: ["auth", "transactions"],
        country_codes: ["US"],
        language: "en",
      }
    );

    res.status(200).json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating Plaid link token:", error);
    res.status(500).json({ error: "Failed to create Plaid link token" });
  }
};