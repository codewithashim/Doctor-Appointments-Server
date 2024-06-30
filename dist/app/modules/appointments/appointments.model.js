"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointments = void 0;
const mongoose_1 = require("mongoose");
const AppointmentsSchema = new mongoose_1.Schema({
    patient_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patients",
        required: true,
    },
    doctor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    appointment_date_time: {
        type: String,
        required: true,
    },
    time_slot: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Appointments = (0, mongoose_1.model)("Appointments", AppointmentsSchema);
