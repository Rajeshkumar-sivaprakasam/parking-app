import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.utils";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      req.user = decoded;
      next();
    } catch (error) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Not authorized, token failed"
      );
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, null, "Not authorized, no token");
  }
};
