"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const message_1 = require("../../../constants/message");
const patients_model_1 = require("../patients/patients.model");
const doctor_model_1 = require("../doctor/doctor.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.create(payload);
        if (payload.role === "Patient") {
            const patient = yield patients_model_1.Patients.create({
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                userId: user === null || user === void 0 ? void 0 : user._id,
                profile: user === null || user === void 0 ? void 0 : user.profile
            });
        }
        else if (payload.role === "Doctor") {
            const doctor = yield doctor_model_1.Doctor.create({
                name: user === null || user === void 0 ? void 0 : user.name,
                profile: user === null || user === void 0 ? void 0 : user.profile,
                email: user === null || user === void 0 ? void 0 : user.email,
                userId: user === null || user === void 0 ? void 0 : user._id,
            });
        }
        return user;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, message_1.responseMessage.INTERNAL_SERVER_ERROR);
    }
});
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    try {
        const user = yield user_model_1.User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // Check password
        const isPasswordMatch = yield user.isPasswordMatched(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
        }
        const { role, email: userEmail, name, phone, id, profile } = user;
        const accessToken = jwtHelper_1.jwtHelper.createToken({ role, email: userEmail, name, phone, id, profile }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
        const refreshToken = jwtHelper_1.jwtHelper.createToken({ role, email: userEmail, name, phone, id }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires);
        return {
            accessToken,
            refreshToken,
            id,
            name,
            phone,
            email: userEmail,
            role,
            profile
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal server error");
    }
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify that the refresh token
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token");
    }
    // check deleted user
    const { email, role, name, phone, id, profile } = verifiedToken;
    const user = new user_model_1.User();
    const isUserExist = yield user.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (role !== "Admin") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden");
    }
    // create access token and refresh token
    const newAccessToken = jwtHelper_1.jwtHelper.createToken({
        id,
        name,
        email,
        phone,
        role,
        profile
    }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // Find the user by email
    const isUserExist = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.email }).select("+password");
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    // Checking old password
    const isPasswordMatched = yield isUserExist.isPasswordMatched(oldPassword, isUserExist.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old Password is incorrect");
    }
    // Update password
    isUserExist.password = newPassword;
    yield isUserExist.save();
});
exports.AuthService = {
    createUser,
    userLogin,
    refreshToken,
    changePassword,
};
