import { Schema, model } from "mongoose";
import { IPatients, PatientsModel } from "./patients.interface";

const PatientsSchema = new Schema<IPatients>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      index: { unique: true },
    },
    profile: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: "Appointments",
    }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Virtual field to populate appointments
PatientsSchema.virtual('userAppointments', {
  ref: 'Appointments',
  localField: '_id',
  foreignField: 'patient_id',
  justOne: false,
});


export const Patients = model<IPatients, PatientsModel>(
  "Patients",
  PatientsSchema
);
