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
            trim: true,
            default: '',
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
            required: false,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
