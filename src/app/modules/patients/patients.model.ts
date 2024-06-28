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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

export const Patients = model<IPatients, PatientsModel>(
  "Patients",
  PatientsSchema
);
