import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { doctorValidator } from "./doctor.validation";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
  validateRequest(doctorValidator.createDoctorZodSchema),
  DoctorController.createDoctor
);

router.get(
  "/get",
  DoctorController.getAllDoctor
);

router.get(
  "/:id",
  DoctorController.getDoctorById
);

router.get(
  "/user/:userId",
  DoctorController.getDoctorByUserId
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
  DoctorController.updateDoctor
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  DoctorController.deleteDoctor
);

export const DoctorsRoutes = router;