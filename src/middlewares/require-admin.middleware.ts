import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/not-authorized.error"

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser?.roles.includes("ADMIN")) {
    throw new NotAuthorizedError()
  }

  next()
}
