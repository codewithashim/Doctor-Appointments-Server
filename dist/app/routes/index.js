"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const patients_router_1 = require("../modules/patients/patients.router");
const doctor_router_1 = require("../modules/doctor/doctor.router");
const appointments_router_1 = require("../modules/appointments/appointments.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/patients",
        route: patients_router_1.PatientsRoutes,
    },
    {
        path: "/doctor",
        route: doctor_router_1.DoctorsRoutes,
    },
    {
        path: "/appointments",
        route: appointments_router_1.AppointmentssRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
