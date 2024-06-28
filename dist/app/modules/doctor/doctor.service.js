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
exports.DoctorService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const doctor_model_1 = require("./doctor.model");
const doctor_constents_1 = require("./doctor.constents");
const createDoctor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.create(payload);
    return doctor;
});
const getAllDoctors = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: doctor_constents_1.doctorSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $paginationOptions: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield doctor_model_1.Doctor.find(whereConditions)
        .populate('userId')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield doctor_model_1.Doctor.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id).populate('userId');
    return doctor;
});
const updateDoctor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield doctor_model_1.Doctor.findOne({ _id: id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Doctor not found");
    }
    const DoctorData = __rest(payload, []);
    const updatedDoctorData = Object.assign({}, DoctorData);
    const result = yield doctor_model_1.Doctor.findOneAndUpdate({ _id: id }, updatedDoctorData, {
        new: true,
    });
    return result;
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findByIdAndDelete(id);
    return doctor;
});
const getDoctorsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctors = yield doctor_model_1.Doctor.find({ userId })
        .populate('userAppointments')
        .exec();
    return doctors;
});
exports.DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    createDoctor,
    getDoctorsByUserId
};
