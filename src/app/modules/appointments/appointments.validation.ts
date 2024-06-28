import { z } from "zod";

const createAppointmentsZodSchema = z.object({
  body: z.object({
    user_id: z.string({
      required_error: "User id is required",
    }),
    doctor_id: z.string({
      required_error: "Doctor id is required",
    }),
  }),
});


export const appointmentsValidator = {
  createAppointmentsZodSchema,
  };
  