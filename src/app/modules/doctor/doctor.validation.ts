import { z } from "zod";

const createDoctorZodSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: "Phone number is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
  }),
});


export const doctorValidator = {
  createDoctorZodSchema,
  };
  