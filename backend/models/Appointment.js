const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
        },
        doctorName: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true,
        },
        patientName: {
            type: String,
            required: [true, 'Patient name is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
