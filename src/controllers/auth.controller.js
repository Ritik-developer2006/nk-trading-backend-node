// controllers/auth.controller.js
const Auth = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// For create user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, number, country, state, address1, address2, pincode, password } = req.body;

        // convert passsword to hashpassword
        const hashedPassword = await bcrypt.hash(password, 10);

        // Call model to create user
        const result = await Auth.create(
            {
                email,
                password: hashedPassword
            },
            {
                firstName,
                lastName,
                number,
                country,
                state,
                address1,
                address2,
                pincode
            }
        );

        if (!result.status) {
            return res.status(400).json(result);
        }

        // JWT for user
        const token = jwt.sign(
            { userId: result.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            status: true,
            message: result.msg,
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// For login user
exports.login = async (req, res) => {
    try {
        const { email, number, password } = req.body;

        // Call model to create user
        const result = await Auth.findByEmail(
            {
                email,
                number
            }
        );

        if (!result.status) {
            return res.status(400).json(result);
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, result.data.password);

        // JWT for user
        const token = jwt.sign(
            { userId: result.data.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            status: true,
            message: 'User found!',
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// For forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email_mobile } = req.body;

        // Call model to create user
        const result = await Auth.findByEmailOrNumber(email_mobile);
        
        if (!result.status) {
            return res.status(400).json(result);
        }

        res.status(201).json({
            status: true,
            message: result.msg,
            otp: result.otp,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
