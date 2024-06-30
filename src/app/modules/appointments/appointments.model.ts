import { Schema, model } from "mongoose";
import { IAppointments, AppointmentsModel } from "./appointments.interface";

const AppointmentsSchema = new Schema<IAppointments>(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointment_date_time : {
      type: String,
      required: true,
    },
    time_slot : {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Appointments = model<IAppointments, AppointmentsModel>(
  "Appointments",
  AppointmentsSchema
);
