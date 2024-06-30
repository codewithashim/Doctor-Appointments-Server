import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { IDoctor } from "./doctor.interface";
import { doctorFilterableFields } from "./doctor.constents";
import { DoctorService } from "./doctor.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await DoctorService.createDoctor(data);

  sendResponse<IDoctor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors fetched successfully!",
    data: result,
  });
});


const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DoctorService.getAllDoctors(
    filters,
    paginationOptions
  );

  sendResponse<IDoctor[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorByUserId = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctorsByUserId(req.params.userId);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully!",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctorById(req.params.id);

  sendResponse<IDoctor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully!",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await DoctorService.updateDoctor(id, updatedData);

  sendResponse<IDoctor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctor(id);
  sendResponse<IDoctor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});

export const DoctorController = {
  deleteDoctor,
  updateDoctor,
  getDoctorById,
  createDoctor,
  getAllDoctor,
  getDoctorByUserId
};