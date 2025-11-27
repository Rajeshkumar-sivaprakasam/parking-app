import { Request, Response, NextFunction } from "express";
import { validationResult, check } from "express-validator";
import { sendResponse } from "../utils/response.utils";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      400,
      false,
      null,
      errors
        .array()
        .map((err) => err.msg)
        .join(", ")
    );
  }
  next();
};

export const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  check("phoneNumber", "Phone number is required").not().isEmpty(),
];

export const loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];
