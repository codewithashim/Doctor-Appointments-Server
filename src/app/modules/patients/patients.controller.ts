import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { patinentFilterableFields } from "./patients.constents";
import { IPatients } from "./patients.interface";
import { PatientService } from "./patients.service";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await PatientService.createPatient(data);

  sendResponse<IPatients>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients fetched successfully!",
    data: result,
  });
});


const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patinentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const user = req?.user; 

  const result = await PatientService.getAllPatients(
    filters,
    paginationOptions
  );

  sendResponse<IPatients[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getPatientByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;  

  const result = await PatientService.getPatientsByUserId(userId);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient fetched successfully!",
    data: result,
  });
});


const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatientById(req.params.id);

  sendResponse<IPatients>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient fetched successfully!",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await PatientService.updatePatient(id, updatedData);

  sendResponse<IPatients>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully!",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deletePatient(id);
  sendResponse<IPatients>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully!",
    data: result,
  });
});

export const PatientController = {
  deletePatient,
  updatePatient,
  getPatientById,
  createPatient,
  getAllPatient,
  getPatientByUserId
};