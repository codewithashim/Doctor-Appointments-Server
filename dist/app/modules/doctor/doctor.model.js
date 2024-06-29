"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const DoctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    specialty: {
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
DoctorSchema.virtual('userAppointments', {
    ref: 'Appointments',
    localField: '_id',
    foreignField: 'doctor_id',
    justOne: false,
});
exports.Doctor = (0, mongoose_1.model)("Doctor", DoctorSchema);
