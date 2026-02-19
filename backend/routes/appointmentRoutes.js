const express = require('express');
const { body } = require('express-validator');
const {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/appointments — Patient only
router.post(
    '/',
    protect,
    authorizeRoles('patient'),
    [
        body('department').trim().notEmpty().withMessage('Department is required'),
        body('doctorName').trim().notEmpty().withMessage('Doctor name is required'),
        body('date').trim().notEmpty().withMessage('Date is required'),
        body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
    ],
    createAppointment
);

// GET /api/appointments — Patient & Doctor
router.get('/', protect, authorizeRoles('patient', 'doctor'), getAppointments);

// PUT /api/appointments/:id — Doctor only
router.put('/:id', protect, authorizeRoles('doctor'), updateAppointmentStatus);

module.exports = router;
