const express = require('express');
const { body } = require('express-validator');
const { register, login, getDoctors } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/auth/doctors — Authenticated users
router.get('/doctors', protect, getDoctors);

// POST /api/auth/register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('role')
            .optional()
            .isIn(['patient', 'doctor'])
            .withMessage('Role must be patient or doctor'),
    ],
    register
);

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
);

module.exports = router;
