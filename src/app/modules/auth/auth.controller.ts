import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { ILoginUserResponse, IRefreshTokenResponse, IUser } from "../user/user.interface";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";
import { responseMessage } from "../../../constants/message";
import { logger } from "../../../shared/logger";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData: IUser = req.body;

  if (!userData.phone) {
    logger.error("Phone number is required");
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Phone number is required",
    });
  }

  logger.info(`CreateUser called with data: ${JSON.stringify(userData)}`);
  const result = await AuthService.createUser(userData);
  logger.info(`CreateUser response: ${JSON.stringify(result?.email)}`);
  
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.SIGNUP_MESSAGE,
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const result = await AuthService.userLogin(loginData);
    
  const cookieOptions = {
    secure: config.env === 'production' ? true : false,
    httpOnly: true,
  };

  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.SIGNIN_MESSAGE,
    data: {
      name: result.name,
      phone: result.phone,
      email: result.email,
      role: result.role,
      accessToken: result.accessToken,
    },
  });
});


const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  logger.info(`RefreshToken called with refreshToken: ${refreshToken}`);
  const result = await AuthService.refreshToken(refreshToken);
  logger.info(`RefreshToken response: ${JSON.stringify(result)}`);

  const cookieOptions = {
    secure: config.env === "production" ? true : false,
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: responseMessage.REFETCH_TOKEN_MESSAGE,
    data: result,
  });
});


const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
  });
});


export const AuthController = {
  createUser,
  userLogin,
  refreshToken,
  changePassword
};
