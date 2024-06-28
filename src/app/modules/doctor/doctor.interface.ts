import { Model, Types } from "mongoose";
 
export type IDoctor = {
  name?: string;
  email?: string;
  specialty?: string;
  userId?: any;
  appointments?:any;
};

export type IDoctorFilter = {
  searchTerm?: string;
  doctor?: Types.ObjectId;
};


export type DoctorModel = Model<IDoctor, Record<string, unknown>>;
