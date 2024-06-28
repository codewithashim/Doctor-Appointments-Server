import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserValidator } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);
router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.getUserById);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(createUserValidator.updateUserZodSchema),
  UserController.updateUser
);
router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

router.get(
  "/my-profile/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DOCTOR),
  UserController.getUserById
);

router.patch(
  "/my-profile/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DOCTOR),
  validateRequest(createUserValidator.updateUserZodSchema),
  UserController.updateUser
);

export const UserRoutes = router;
