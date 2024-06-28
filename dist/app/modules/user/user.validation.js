"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidator = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        role: zod_1.z.enum(["Patient", "Admin", "Doctor"]),
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        role: zod_1.z.enum(["Patient", "Admin", "Doctor"]).optional(),
        password: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
    })
        .optional(),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
        password: zod_1.z.string({
            required_error: "password is required",
        }),
    }),
});
const refreshTokenSchema = zod_1.z.object({
    cookie: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: "refreshToken is required",
        }),
    }),
});
const changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'oldPassword is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'newPassword is required',
        }),
    }),
});
exports.createUserValidator = {
    createUserZodSchema,
    updateUserZodSchema,
    refreshTokenSchema,
    loginUserZodSchema,
    changePasswordSchema
};
