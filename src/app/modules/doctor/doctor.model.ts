import { Schema, model } from "mongoose";
import { IDoctor, DoctorModel } from "./doctor.interface";

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    specialty: {
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

DoctorSchema.virtual('userAppointments', {
  ref: 'Appointments',
  localField: '_id',
  foreignField: 'doctor_id',
  justOne: false,  
});

export const Doctor = model<IDoctor, DoctorModel>(
  "Doctor",
  DoctorSchema
);
