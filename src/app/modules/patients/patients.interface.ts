import { Model, Types } from "mongoose";
 
export type IPatients = {
  name?: string;
  email?: string;
  phone?: string;
  userId?: any;
};

export type IPatientFilter = {
  searchTerm?: string;
  patient?: Types.ObjectId;
};


export type PatientsModel = Model<IPatients, Record<string, unknown>>;
