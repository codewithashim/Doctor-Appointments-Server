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
exports.UserService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const message_1 = require("../../../constants/message");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find();
        return users;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `${message_1.responseMessage.FAILD_MESSAGE} get all user`);
    }
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `User ${message_1.responseMessage.NOT_FOUND}`);
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `${message_1.responseMessage.FAILD_MESSAGE} get user by ID`);
    }
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield user_model_1.User.findOne({ _id: id });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `User ${message_1.responseMessage.NOT_FOUND}`);
        }
        const updateUserData = payload;
        const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updateUserData, {
            new: true,
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `${message_1.responseMessage.FAILD_MESSAGE} update user`);
    }
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndDelete(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `User ${message_1.responseMessage.NOT_FOUND}`);
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `${message_1.responseMessage.FAILD_MESSAGE} delete user`);
    }
});
exports.UserService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
