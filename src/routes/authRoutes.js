const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validators/authValidator');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    getProfile
} = require('../controllers/authController');

router.post('/register', validate(registerSchema), register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/profile', protect, getProfile);

module.exports = router;