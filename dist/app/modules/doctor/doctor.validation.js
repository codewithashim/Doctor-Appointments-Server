"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidator = void 0;
const zod_1 = require("zod");
const createDoctorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
    }),
});
exports.doctorValidator = {
    createDoctorZodSchema,
};
