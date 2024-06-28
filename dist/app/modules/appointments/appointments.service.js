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
exports.AppointmentsService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = __importDefault(require("mongoose"));
const appointments_model_1 = require("./appointments.model");
const patients_model_1 = require("../patients/patients.model");
const doctor_model_1 = require("../doctor/doctor.model");
const message_1 = require("../../../constants/message");
const createAppointments = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield appointments_model_1.Appointments.create(payload);
        yield patients_model_1.Patients.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.patient_id, {
            $push: { appointments: appointment._id }
        });
        yield doctor_model_1.Doctor.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.doctor_id, {
            $push: { appointments: appointment._id }
        });
        return appointment;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, message_1.responseMessage.INTERNAL_SERVER_ERROR);
    }
});
const getAllAppointments = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield appointments_model_1.Appointments.find()
        .populate("patient_id").populate("doctor_id")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield appointments_model_1.Appointments.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAppointmentsWithDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointments_model_1.Appointments.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "patients",
                localField: "patient_id",
                foreignField: "_id",
                as: "patient"
            }
        },
        {
            $lookup: {
                from: "doctors",
                localField: "doctor_id",
                foreignField: "_id",
                as: "doctor"
            }
        },
        { $unwind: "$patient" },
        { $unwind: "$doctor" }
    ]);
    return appointment[0];
});
const updateAppointments = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield appointments_model_1.Appointments.findOne({ _id: id });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Appointments not found");
        }
        const AppointmentsData = __rest(payload, []);
        const updatedAppointmentsData = Object.assign({}, AppointmentsData);
        const result = yield appointments_model_1.Appointments.findOneAndUpdate({ _id: id }, updatedAppointmentsData, {
            new: true,
        });
        if (payload.patient_id) {
            yield patients_model_1.Patients.findByIdAndUpdate(payload.patient_id, {
                $addToSet: { appointments: id }
            });
        }
        if (payload.doctor_id) {
            yield doctor_model_1.Doctor.findByIdAndUpdate(payload.doctor_id, {
                $addToSet: { appointments: id }
            });
        }
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, message_1.responseMessage.INTERNAL_SERVER_ERROR);
    }
});
const deleteAppointments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield appointments_model_1.Appointments.findByIdAndDelete(id);
        if (appointment) {
            yield patients_model_1.Patients.findByIdAndUpdate(appointment.patient_id, {
                $pull: { appointments: appointment._id }
            });
            yield doctor_model_1.Doctor.findByIdAndUpdate(appointment.doctor_id, {
                $pull: { appointments: appointment._id }
            });
        }
        return appointment;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, message_1.responseMessage.INTERNAL_SERVER_ERROR);
    }
});
const getAppointmentsByUserId = (userId, userType, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const matchCondition = userType === "patient"
        ? { patient_id: new mongoose_1.default.Types.ObjectId(userId) }
        : { doctor_id: new mongoose_1.default.Types.ObjectId(userId) };
    const appointments = yield appointments_model_1.Appointments.aggregate([
        { $match: matchCondition },
        {
            $lookup: {
                from: "patients",
                localField: "patient_id",
                foreignField: "_id",
                as: "patient"
            }
        },
        {
            $lookup: {
                from: "doctors",
                localField: "doctor_id",
                foreignField: "_id",
                as: "doctor"
            }
        },
        { $unwind: "$patient" },
        { $unwind: "$doctor" },
        // { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit }
    ]);
    const total = yield appointments_model_1.Appointments.countDocuments(matchCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: appointments,
    };
});
exports.AppointmentsService = {
    getAllAppointments,
    updateAppointments,
    deleteAppointments,
    createAppointments,
    getAppointmentsWithDetails,
    getAppointmentsByUserId
};
