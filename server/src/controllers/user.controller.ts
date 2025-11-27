import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { sendResponse } from "../utils/response.utils";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    sendResponse(res, 200, true, users);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendResponse(res, 404, false, null, "User not found");
    sendResponse(res, 200, true, user);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: IUser = new User(req.body);
    const savedUser = await newUser.save();
    sendResponse(res, 201, true, savedUser);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return sendResponse(res, 404, false, null, "User not found");
    sendResponse(res, 200, true, updatedUser);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return sendResponse(res, 404, false, null, "User not found");
    sendResponse(res, 200, true, null, "User deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
