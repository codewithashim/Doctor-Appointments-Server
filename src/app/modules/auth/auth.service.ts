import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from "../user/user.interface";
import { User } from "../user/user.model";
import { jwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { responseMessage } from "../../../constants/message";
import { Patients } from "../patients/patients.model";

const createUser = async (payload: IUser): Promise<IUser | null> => {
  try {
    const user = await User.create(payload);
    if(payload.role === "Patient"){
      const patient = await Patients.create({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        userId: user?._id
      });
    }
    return user;
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

const userLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check password
    const isPasswordMatch = await user.isPasswordMatched(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
    }

    const { role, email: userEmail, name, phone } = user;
    const accessToken = jwtHelper.createToken(
      { role, email: userEmail, name, phone },
      config.jwt.secret as Secret,
      config.jwt.expiresIn as string
    );

    const refreshToken = jwtHelper.createToken(
      { role, email: userEmail, name, phone },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires as string
    );

    return {
      accessToken,
      refreshToken,
      name,
      phone,
      email: userEmail,
      role,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};


const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // verify that the refresh token
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  // check deleted user

  const { userId, role } = verifiedToken;
  const user = new User();
  const isUserExist = await user.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // create access token and refresh token
  const newAccessToken = jwtHelper.createToken(
    {
      userId,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // Find the user by email
  const isUserExist = await User.findOne({ email: user?.email }).select(
    '+password'
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Checking old password
  const isPasswordMatched = await isUserExist.isPasswordMatched(
    oldPassword,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  // Update password
  isUserExist.password = newPassword;
  await isUserExist.save();
};

export const AuthService = {
  createUser,
  userLogin,
  refreshToken,
  changePassword
};
