"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patients = void 0;
const mongoose_1 = require("mongoose");
const PatientsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        index: { unique: true },
    },
    profile: {
        type: String,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    appointments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Appointments",
        }],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Virtual field to populate appointments
PatientsSchema.virtual('userAppointments', {
    ref: 'Appointments',
    localField: '_id',
    foreignField: 'patient_id',
    justOne: false,
});
exports.Patients = (0, mongoose_1.model)("Patients", PatientsSchema);
