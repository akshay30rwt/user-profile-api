const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = generateToken();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken
        });

        await user.save();

        const verificationUrl = `http://localhost:3000/auth/verify-email/${verificationToken}`;

        await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            html: `
                <h2>Welcome ${name}</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        });

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.'
        });

    } catch (err) {
        next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        if(!user) {
            throw new AppError('Invalid or expired verification token', 400);
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully. You can now login.'
        });
    }
    catch(error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            throw new AppError('Invalid email or password', 400);
        }

        if(!user.isVerified) {
            throw new AppError('Please verify your email before logging in', 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            throw new AppError('Invalid email or password', 400);
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token });
    }
    catch(error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            throw new AppError('No account found with this email', 404);
        }

        const resetToken = generateToken();
        const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetExpiry;
        await user.save();

        const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>You requested a password reset. Click the link below:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, ignore this email.</p>
            `
        });

        res.status(200).json({
            message: 'Password reset link sent to your email'
        });
    }
    catch(error) {
        next(error);
    }
};