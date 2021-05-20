import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/not-authorized.error"

export const requireOwnAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id !== req.currentUser?.id) {
    throw new NotAuthorizedError()
  }

  next()
}
