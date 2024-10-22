import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { PatientsRoutes } from "../modules/patients/patients.router";
import { DoctorsRoutes } from "../modules/doctor/doctor.router";
import { AppointmentsRoutes } from "../modules/appointments/appointments.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/patients",
    route: PatientsRoutes,
  },
  {
    path: "/doctor",
    route: DoctorsRoutes,
  },
  {
    path: "/appointments",
    route: AppointmentsRoutes,
  },
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
