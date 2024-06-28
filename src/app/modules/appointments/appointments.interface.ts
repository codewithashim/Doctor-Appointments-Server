import { Model } from "mongoose";
 
export type IAppointments = {
  patient_id?: string;
  doctor_id?: string;
  appointment_date_time?: string;
};

export type AppointmentsModel = Model<IAppointments, Record<string, unknown>>;