"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsValidator = void 0;
const zod_1 = require("zod");
const createAppointmentsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        patient_id: zod_1.z.string({
            required_error: "User id is required",
        }),
        doctor_id: zod_1.z.string({
            required_error: "Doctor id is required",
        }),
    }),
});
exports.appointmentsValidator = {
    createAppointmentsZodSchema,
};
