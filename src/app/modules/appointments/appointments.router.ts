import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { appointmentsValidator } from "./appointments.validation";
import { AppointmentsController } from "./appointments.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(appointmentsValidator.createAppointmentsZodSchema),
  AppointmentsController.createAppointments
);

router.get(
  "/get",
  AppointmentsController.getAllAppointments
);

router.get(
  "/user/:id/:userType",
  AppointmentsController.getAppointmentsByUser
)

router.get(
  "/:id",
  AppointmentsController.getAppointmentsById
);


router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DOCTOR),
  AppointmentsController.updateAppointments
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DOCTOR),
  AppointmentsController.deleteAppointments
);

export const AppointmentsRoutes = router;