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
exports.PatientService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const patients_constents_1 = require("./patients.constents");
const patients_model_1 = require("./patients.model");
const message_1 = require("../../../constants/message");
const createPatient = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patients_model_1.Patients.create(payload);
    return patient;
});
const getAllPatients = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: patients_constents_1.patinentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $paginationOptions: "i",
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
    const result = yield patients_model_1.Patients.find(whereConditions)
        .populate("userId")
        .populate({
        path: "appointments",
        options: { sort: { createdAt: -1 } },
    })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield patients_model_1.Patients.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getPatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patients_model_1.Patients.findById(id)
        .populate("userId")
        .populate({
        path: "appointments",
        options: { sort: { createdAt: -1 } },
    });
    return patient;
});
const getPatientsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patients_model_1.Patients.findOne({ userId })
            .populate({
            path: "userAppointments",
            options: { sort: { createdAt: -1 } },
        })
            .exec();
        return patients;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `${message_1.responseMessage.FAILD_MESSAGE} get patient`);
    }
});
const updatePatient = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield patients_model_1.Patients.findOne({ _id: id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Patient not found");
    }
    const PatientData = __rest(payload, []);
    const updatedPatientData = Object.assign({}, PatientData);
    const result = yield patients_model_1.Patients.findOneAndUpdate({ _id: id }, updatedPatientData, {
        new: true,
    });
    return result;
});
const deletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patients_model_1.Patients.findByIdAndDelete(id);
    return patient;
});
exports.PatientService = {
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    createPatient,
    getPatientsByUserId,
};
