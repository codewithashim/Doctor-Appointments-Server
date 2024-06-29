"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const multer_1 = __importDefault(require("../../middlewares/multer/multer"));
const router = express_1.default.Router();
router.post('/signup', multer_1.default.single('profile'), (0, validateRequest_1.default)(user_validation_1.createUserValidator.createUserZodSchema), auth_controller_1.AuthController.createUser);
router.post("/login", (0, validateRequest_1.default)(user_validation_1.createUserValidator.loginUserZodSchema), auth_controller_1.AuthController.userLogin);
router.post("/refresh-token", (0, validateRequest_1.default)(user_validation_1.createUserValidator.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.DOCTOR), (0, validateRequest_1.default)(user_validation_1.createUserValidator.changePasswordSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
