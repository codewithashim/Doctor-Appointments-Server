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
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Patients = (0, mongoose_1.model)("Patients", PatientsSchema);
