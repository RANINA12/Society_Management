const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

// requiring models
const { User, Otp } = require("../models/model");

// requiring controllers
const { sendOtpMail, sendLoginVerificationMail } = require("./mailController");

// getting jwt token
const JWT_SECRET = process.env.JWT_SECRET;

// route - http://localhost:8080/api/user/login


const logIn = async (req, res) => {
    const Email = req.body.email;
    const Password = req.body.password;

    try {
        const user = await User.findOne({ email: Email });
        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const validPassword = await bcrypt.compare(Password, user.password);
        if (validPassword) {
            const Details = {
                email: user.email,
                name: user.username,
            };
            console.log(user);
            sendLoginVerificationMail(Details);
            return res.status(200).send({
                msg: "Log-In successful!",
                user_id: user.user_id,
            });
        } else {
            return res.status(406).send({ msg: "Invalid password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Server error" });
    }
};


const signUp = async (req, res) => {
    const Email = req.body.email;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: Email });
        if (existingUser) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        // Clearing OTP auth table
        await Otp.deleteMany({ email: Email });
        console.log("Old OTPs deleted successfully");

        // Generate OTP for new user
        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        const otp = {
            email: Email,
            otp: OTP,
        };
        console.log("Before hashing: ", otp);

        // Send OTP email
        sendOtpMail(Email, otp.otp);

        // Encrypting the OTP and saving it to the Otp table
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);

        const newUserLogin = new Otp({
            email: otp.email,
            otp: otp.otp,
        });

        // Save the OTP to the database
        await newUserLogin.save();
        console.log("Saved: OTP ready for validation");

        return res.status(200).send({ msg: "Otp sent successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Server error" });
    }
};


// // route - http://localhost:8080/api/user/signup/verify


const verifySignup = async (req, res) => {
    const number = req.body.contactNumber;
    const inputOtp = req.body.otp;
    const Email = req.body.email;
    const name = req.body.username;
    const Password = req.body.password;
    const Lat = req.body.lat;
    const Long = req.body.long;

    try {
        // Encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Find the OTP document
        const otpDocs = await Otp.find({ email: Email });
        if (otpDocs.length === 0) {
            return res.status(400).send("The OTP expired. Please try again!");
        }

        const generatedOtp = otpDocs[0].otp;

        // Compare the input OTP with the generated OTP
        const validUser = await bcrypt.compare(inputOtp, generatedOtp);
        if (Email === otpDocs[0].email && validUser) {
            // Generating user token
            const payload = { email: Email };
            const token = jwt.sign(payload, JWT_SECRET);

            // Saving new user
            const newUser = new User({
                user_id: token,
                username: name,
                email: Email,
                contactNumber: number,
                password: hashedPassword,
                lat: Lat,
                long: Long,
            });

            await newUser.save();
            console.log("Signup successful: ", newUser);

            // Clearing OTP records
            await Otp.deleteMany({ email: Email });
            console.log(`OTP table for ${Email} cleared.`);

            return res.status(200).send({
                msg: "Account creation successful!",
                user_id: token,
            });
        } else {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Server error" });
    }
};

// route - http://localhost:8080/api/user/signup/resendOtp
const resendOtp = async (req, res) => {
    const Email = req.body.email;

    // validating whether user already exists or not
    const user = await User.findOne({ Email });
    if (user) {
        return res.status(400).send({
            msg: "This Email ID is not registered. Try Signing Up instead!",
        });
    }

    // clearing old otps
    try {
        await Otp.deleteMany({ email: Email }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Old OTP deleted successfully");
            }
        });
    } catch (e) {
        console.log(e);
    }

    // generate new otp for the user
    const OTP = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });

    const otp = {
        email: Email,
        otp: OTP,
    };
    console.log("New OTP Before hashing: ", otp);

    sendOtpMail(Email, otp.otp);

    //encrypting the otp and then saving to Otp_table
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);

    const newUserLogin = new Otp({
        email: otp.email,
        otp: otp.otp,
    });

    newUserLogin.save((error, success) => {
        if (error) console.log(error);
        else console.log("Saved::otp::ready for validation");
    });

    return res.status(200).send({ msg: "New Otp sent successfully!" });
};

// route - http://localhost:8080/api/user/getallusers
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

//route - http://localhost:8080/api/user/getuser

const userDetails = async (req, res) => {
    const user_id = req.body.user_id;
    console.log(user_id);

    try {
        // Find the user by user_id
        const user = await User.findOne({ user_id: user_id });
        
        if (!user) {
            return res.status(400).send({ msg: "No such user exists" });
        }
        
        // Send user details
        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Server error" });
    }
};


module.exports = {
    signUp,
    verifySignup,
    logIn,
    resendOtp,
    getAllUsers,
    userDetails,
};
