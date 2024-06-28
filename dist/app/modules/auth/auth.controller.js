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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const message_1 = require("../../../constants/message");
const logger_1 = require("../../../shared/logger");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData.phone) {
        logger_1.logger.error("Phone number is required");
        return res.status(http_status_1.default.BAD_REQUEST).send({
            success: false,
            message: "Phone number is required",
        });
    }
    logger_1.logger.info(`CreateUser called with data: ${JSON.stringify(userData)}`);
    const result = yield auth_service_1.AuthService.createUser(userData);
    logger_1.logger.info(`CreateUser response: ${JSON.stringify(result === null || result === void 0 ? void 0 : result.email)}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: message_1.responseMessage.SIGNUP_MESSAGE,
        data: result,
    });
}));
const userLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = req.body;
    const result = yield auth_service_1.AuthService.userLogin(loginData);
    const cookieOptions = {
        secure: config_1.default.env === 'production' ? true : false,
        httpOnly: true,
    };
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: message_1.responseMessage.SIGNIN_MESSAGE,
        data: {
            id: result.id,
            name: result.name,
            phone: result.phone,
            email: result.email,
            role: result.role,
            accessToken: result.accessToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    logger_1.logger.info(`RefreshToken called with refreshToken: ${refreshToken}`);
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    logger_1.logger.info(`RefreshToken response: ${JSON.stringify(result)}`);
    const cookieOptions = {
        secure: config_1.default.env === "production" ? true : false,
        httpOnly: true,
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: message_1.responseMessage.REFETCH_TOKEN_MESSAGE,
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const passwordData = __rest(req.body, []);
    yield auth_service_1.AuthService.changePassword(user, passwordData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully !',
    });
}));
exports.AuthController = {
    createUser,
    userLogin,
    refreshToken,
    changePassword
};
