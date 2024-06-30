import { Model } from "mongoose";
 
export type IAppointments = {
  patient_id?: string;
  doctor_id?: string;
  appointment_date_time?: any;
  time_slot?: any;
};

export type AppointmentsModel = Model<IAppointments, Record<string, unknown>>;