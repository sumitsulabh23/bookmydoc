const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Patient only
const createAppointment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { department, doctorName, doctorId, date, timeSlot } = req.body;

        const appointment = await Appointment.create({
            department,
            doctorName,
            doctorId,
            patientName: req.user.name,
            date,
            timeSlot,
            patientId: req.user._id,
        });

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Patient (own) | Doctor (assigned to them)
const getAppointments = async (req, res, next) => {
    try {
        let appointments;

        if (req.user.role === 'patient') {
            // Patients see only their own appointments
            appointments = await Appointment.find({ patientId: req.user._id }).sort({
                createdAt: -1,
            });
        } else if (req.user.role === 'doctor') {
            // Doctors see appointments assigned to them by their unique ID
            appointments = await Appointment.find({ doctorId: req.user._id }).sort({
                createdAt: -1,
            });
        }

        res.status(200).json({ appointments });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status (approve/reject)
// @route   PUT /api/appointments/:id
// @access  Doctor only
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify the doctor is assigned to this appointment
        if (appointment.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to update this appointment',
            });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            message: `Appointment ${status} successfully`,
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
