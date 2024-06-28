import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { IDoctorFilter, IDoctor } from "./doctor.interface";
import { Doctor } from "./doctor.model";
import { doctorSearchableFields } from "./doctor.constents";


const createDoctor = async (payload: IDoctor): Promise<IDoctor | null> => {
  const doctor = await Doctor.create(payload);
  return doctor;
};


const getAllDoctors = async (
  filters: IDoctorFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDoctor[]>> => {

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: doctorSearchableFields.map(field => ({
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

  const sortConditions: { [key: string]: SortOrder } = {};
  

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Doctor.find(whereConditions)
    .populate('userId')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Doctor.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};


const getDoctorById = async (id: string): Promise<IDoctor | null> => {
  const doctor = await Doctor.findById(id).populate('userId');
  return doctor;
};

const updateDoctor = async (
  id: string,
  payload: Partial<IDoctor>
): Promise<IDoctor | null> => {
  const isExist = await Doctor.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const { ...DoctorData } = payload;
  const updatedDoctorData: Partial<IDoctor> = { ...DoctorData };

  const result = await Doctor.findOneAndUpdate(
    { _id: id },
    updatedDoctorData,
    {
      new: true,
    }
  );
  return result;
};

const deleteDoctor = async (id: string): Promise<IDoctor | null> => {
  const doctor = await Doctor.findByIdAndDelete(id);
  return doctor;
};


const getDoctorsByUserId = async (userId: string): Promise<IDoctor[]> => {
  const doctors = await Doctor.find({ userId })
    .populate('userAppointments')
    .exec();

  return doctors;
};


export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  createDoctor,
  getDoctorsByUserId
};