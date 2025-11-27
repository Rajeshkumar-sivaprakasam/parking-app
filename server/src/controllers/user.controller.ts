import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { sendResponse } from "../utils/response.utils";
import bcrypt from "bcryptjs";
import { EncryptionUtils } from "../utils/EncryptionUtils";

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
    const { password, ...rest } = req.body;

    // Decrypt password
    const decryptedPassword = EncryptionUtils.decrypt(password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(decryptedPassword, salt);

    const newUser: IUser = new User({ ...rest, password: hashedPassword });
    const savedUser = await newUser.save();

    // Don't send password back
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    sendResponse(res, 201, true, userResponse);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      // Decrypt password
      const decryptedPassword = EncryptionUtils.decrypt(updates.password);

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(decryptedPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedUser)
      return sendResponse(res, 404, false, null, "User not found");

    // Don't send password back
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    sendResponse(res, 200, true, userResponse);
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 404, false, null, "User not found");

    // Decrypt password from payload
    const decryptedPassword = EncryptionUtils.decrypt(password);

    const isMatch = await bcrypt.compare(
      decryptedPassword,
      user.password || ""
    );
    if (!isMatch)
      return sendResponse(res, 401, false, null, "Invalid credentials");

    // In a real app, generate a real token (JWT)
    const token = "dummy-jwt-token-" + user._id;

    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, 200, true, { user: userResponse, token });
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
