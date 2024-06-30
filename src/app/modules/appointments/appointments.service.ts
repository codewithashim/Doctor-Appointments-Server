import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import mongoose, { SortOrder } from "mongoose";
import { IAppointments } from "./appointments.interface";
import { Appointments } from "./appointments.model";
import { Doctor } from "../doctor/doctor.model";
import { responseMessage } from "../../../constants/message";
import { Patients } from "../patients/patients.model";

const createAppointments = async (
  payload: IAppointments
): Promise<IAppointments | null> => {
  try {
    const appointment = await Appointments.create(payload);

    console.log(appointment , 'appointment')

    console.log(payload?.patient_id , "payload?.patient_id")

    await Patients.findByIdAndUpdate(payload?.patient_id, {
      $push: { appointments: appointment?._id }
    });

    await Doctor.findByIdAndUpdate(payload?.doctor_id, {
      $push: { appointments: appointment?._id }
    });

    return appointment;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
  }
};

const getAllAppointments = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAppointments[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Appointments.find()
    .populate("patient_id").populate("doctor_id")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Appointments.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAppointmentsWithDetails = async (
  id: string
): Promise<IAppointments | null> => {
  const appointment = await Appointments.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
};

const updateAppointments = async (
  id: string,
  payload: Partial<IAppointments>
): Promise<IAppointments | null> => {
  try {
    const isExist = await Appointments.findOne({ _id: id });
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "Appointments not found");
    }

    const { ...AppointmentsData } = payload;
    const updatedAppointmentsData: Partial<IAppointments> = {
      ...AppointmentsData,
    };

    const result = await Appointments.findOneAndUpdate(
      { _id: id },
      updatedAppointmentsData,
      {
        new: true,
      }
    );

    if (payload.patient_id) {
      await Patients.findByIdAndUpdate(payload.patient_id, {
        $addToSet: { appointments: id }
      });
    }

    if (payload.doctor_id) {
      await Doctor.findByIdAndUpdate(payload.doctor_id, {
        $addToSet: { appointments: id }
      });
    }

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
  }
};

const deleteAppointments = async (
  id: string
): Promise<IAppointments | null> => {
  try {
    const appointment = await Appointments.findByIdAndDelete(id);

    if (appointment) {
      await Patients.findByIdAndUpdate(appointment.patient_id, {
        $pull: { appointments: appointment._id }
      });

      await Doctor.findByIdAndUpdate(appointment.doctor_id, {
        $pull: { appointments: appointment._id }
      });
    }

    return appointment;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
  }
};

const getAppointmentsByUserId = async (
  userId: string,
  userType: "Patient" | "Doctor",
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAppointments[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const matchCondition = userType === "Patient" 
    ? { patient_id: new mongoose.Types.ObjectId(userId) }
    : { doctor_id: new mongoose.Types.ObjectId(userId) };

  const appointments = await Appointments.aggregate([
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

  const total = await Appointments.countDocuments(matchCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: appointments,
  };
};


export const AppointmentsService = {
  getAllAppointments,
  updateAppointments,
  deleteAppointments,
  createAppointments,
  getAppointmentsWithDetails,
  getAppointmentsByUserId
};
