const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// requiring models
const { Handyman, Otp } = require("../models/model");
// requiring controllers
const { sendOtpMail, sendLoginVerificationMail } = require("./mailController");
// requiring utility functions
const cloudinary = require("../utils/cloudinary");

// route - http://localhost:8080/api/handyman/signup


const handymanSignup = async (req, res) => {
    const Email = req.body.email;

    try {
        // Check if the handyman already exists
        const existingHandyman = await Handyman.findOne({ email: Email });
        if (existingHandyman) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        // Clearing old OTPs
        await Otp.deleteMany({ email: Email });
        console.log("Old OTP records cleared successfully");

        // Generate OTP for new handyman
        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        console.log("Generated OTP: ", OTP);
        sendOtpMail(Email, OTP);

        // Encrypt the OTP and save it to Otp table
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(OTP, salt);

        const newHandymanLogin = new Otp({
            email: Email,
            otp: hashedOtp,
        });

        await newHandymanLogin.save();
        console.log("OTP saved successfully, ready for validation");

        return res.status(200).send({ msg: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error during handyman signup:", error);
        return res.status(500).send({ msg: "Server error" });
    }
};


const handymanVerifySignup = async (req, res) => {
    console.log(req.body);
    const {
        name: Name,
        email: Email,
        otp: inputOtp,
        password: Password,
        phone: Phone,
        aadharNumber: AadharNumber,
        services: Services,
        profile: Profile,
        lat: Lat,
        long: Long,
    } = req.body;

    try {
        // Find the OTP document
        const otpDocs = await Otp.find({ email: Email });
        if (otpDocs.length === 0) {
            return res.status(400).send("The OTP expired. Please try again!");
        }

        const generatedOtp = otpDocs[0].otp;

        // Compare the input OTP with the generated OTP
        const validHandyman = await bcrypt.compare(inputOtp, generatedOtp);
        if (!validHandyman) {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }

        // Generating handyman token
        const payload = { email: Email };
        const token = jwt.sign(payload, JWT_SECRET);

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Create a new handyman
        const newHandyman = new Handyman({
            handyman_id: token,
            name: Name,
            email: Email,
            phone: Phone,
            password: hashedPassword,
            aadharNumber: AadharNumber,
            aadharFront: undefined,  // You may want to handle these fields appropriately
            aadharBack: undefined,
            lat: Lat,
            long: Long,
            services: Services,
            profile: Profile,
            usersSelected: [],
        });

        await newHandyman.save();
        console.log("Saved::New Handyman::credentials.");

        // Clear the OTP records
        await Otp.deleteMany({ email: Email });
        console.log(`OTP table for ${Email} cleared.`);

        return res.status(200).send({
            msg: "Handyman account creation successful!",
            handyman_id: token,
        });
    } catch (error) {
        console.error("Error during handyman verification signup:", error);
        return res.status(500).send({ msg: "Server error" });
    }
};


 // route - http://localhost:8080/api/handyman/login

const handymanLogin = async (req, res) => {
    const { email: Email, password: Password } = req.body;

    try {
        // Find the handyman by email
        const handyman = await Handyman.findOne({ email: Email });
        if (!handyman) {
            return res.status(400).send({ msg: "Handyman not found" });
        }

        // Check password validity
        const validPassword = await bcrypt.compare(Password, handyman.password);
        if (!validPassword) {
            return res.status(406).send({ msg: "Invalid password" });
        }

        // Send login verification mail
        const Details = {
            email: handyman.email,
            name: handyman.handymanname,
        };
        console.log(handyman);
        sendLoginVerificationMail(Details);

        // Respond with success
        res.status(200).send({
            msg: "Log-In successful!",
            handyman_id: handyman.handyman_id,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ msg: "Server error" });
    }
};


// route - http://localhost:8080/api/handyman/getallhandyman
const getAllHandyman = async (req, res) => {
    try {
        const handyman = await Handyman.find({});
        res.status(200).json(handyman);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// route - http://localhost:8080/api/handyman/gethandyman

const handymanDetails = async (req, res) => {
    const handyman_id = req.body.handyman_id;

    try {
        const docs = await Handyman.find({ handyman_id: handyman_id });

        if (docs.length === 0) {
            return res.status(404).send({ msg: "No such handyman exists" });
        }

        res.status(200).send(docs[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Server error" });
    }
};



const jobStartOtpVerify = async (req, res) => {
    const { otp, email: Email } = req.body;

    try {
        // Find the OTP document for the given email
        const otpDocs = await Otp.find({ email: Email });
        if (otpDocs.length === 0) {
            return res.status(400).send("The OTP expired. Please try again!");
        }

        const generatedOtp = otpDocs[0].otp;

        // Compare the input OTP with the generated OTP
        const validOtp = await bcrypt.compare(otp, generatedOtp);
        if (!validOtp) {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }

        // Clear the OTP records for the email
        await Otp.deleteMany({ email: Email });
        console.log(`OTP table for ${Email} cleared.`);

        // Respond with success
        return res.status(200).send({ msg: "Job Started" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).send({ msg: "Server error" });
    }
};

module.exports = {
    handymanVerifySignup,
    handymanSignup,
    handymanLogin,
    handymanDetails,
    getAllHandyman,
    jobStartOtpVerify,
};
