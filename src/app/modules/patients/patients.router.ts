import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { PatientController } from "./patients.controller";
import { patientsValidator } from "./patients.validation";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(patientsValidator.createPatientsZodSchema),
  PatientController.createPatient
);

router.get(
  "/get",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PatientController.getAllPatient
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PatientController.getPatientById
);

router.get(
  "/user/:userId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PatientController.getPatientByUserId
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PatientController.updatePatient
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PatientController.deletePatient
);

export const PatientsRoutes = router;