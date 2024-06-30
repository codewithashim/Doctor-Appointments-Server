import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { IAppointments } from "./appointments.interface";
import { AppointmentsService } from "./appointments.service";

const createAppointments = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AppointmentsService.createAppointments(data);
  sendResponse<IAppointments>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointmentss fetched successfully!",
    data: result,
  });
});


const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AppointmentsService.getAllAppointments(paginationOptions);

  sendResponse<IAppointments[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointments fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getAppointmentsByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId, userType } = req.params; 
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AppointmentsService.getAppointmentsByUserId(userId, userType as "Patient" | "Doctor", paginationOptions);

  sendResponse<IAppointments[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});



const getAppointmentsById = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentsService.getAppointmentsWithDetails(req.params.id);

  sendResponse<IAppointments>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments fetched successfully!",
    data: result,
  });
});

const updateAppointments = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await AppointmentsService.updateAppointments(id, updatedData);

  sendResponse<IAppointments>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments updated successfully!",
    data: result,
  });
});

const deleteAppointments = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AppointmentsService.deleteAppointments(id);
  sendResponse<IAppointments>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments deleted successfully!",
    data: result,
  });
});

export const AppointmentsController = {
  deleteAppointments,
  updateAppointments,
  getAppointmentsById,
  createAppointments,
  getAllAppointments,
  getAppointmentsByUser
};