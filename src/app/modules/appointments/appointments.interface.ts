import { Model } from "mongoose";
 
export type IAppointments = {
  patient_id?: string;
  doctor_id?: string;
  appointment_date_time?: any;
  appointment_date?: any;
};

export type AppointmentsModel = Model<IAppointments, Record<string, unknown>>;