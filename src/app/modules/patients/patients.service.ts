import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { patinentSearchableFields } from "./patients.constents";
import { IPatientFilter, IPatients } from "./patients.interface";
import { Patients } from "./patients.model";
import { responseMessage } from "../../../constants/message";

const createPatient = async (payload: IPatients): Promise<IPatients | null> => {
  const patient = await Patients.create(payload);
  return patient;
};

const getAllPatients = async (
  filters: IPatientFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPatients[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: patinentSearchableFields.map((field) => ({
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

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Patients.find(whereConditions)
    .populate("userId")
    .populate({
      path: "appointments",
      options: { sort: { createdAt: -1 } },
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Patients.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPatientById = async (id: string): Promise<IPatients | null> => {
  const patient = await Patients.findById(id)
    .populate("userId")
    .populate({
      path: "appointments",
      options: { sort: { createdAt: -1 } },
    });
  return patient;
};

const getPatientsByUserId = async (userId: string): Promise<any> => {
  try {
    const patients = await Patients.findOne({ userId })
    .populate({
      path: "userAppointments",
      options: { sort: { createdAt: -1 } },
    })
    .exec();
    return patients;
  } catch (error) {
    console.log(error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `${responseMessage.FAILD_MESSAGE} get patient`
    );
  }
};

const updatePatient = async (
  id: string,
  payload: Partial<IPatients>
): Promise<IPatients | null> => {
  const isExist = await Patients.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }

  const { ...PatientData } = payload;
  const updatedPatientData: Partial<IPatients> = { ...PatientData };

  const result = await Patients.findOneAndUpdate(
    { _id: id },
    updatedPatientData,
    {
      new: true,
    }
  );
  return result;
};

const deletePatient = async (id: string): Promise<IPatients | null> => {
  const patient = await Patients.findByIdAndDelete(id);
  return patient;
};

export const PatientService = {
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  createPatient,
  getPatientsByUserId,
};
