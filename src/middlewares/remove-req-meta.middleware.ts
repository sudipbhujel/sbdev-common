import { Request, Response, NextFunction } from "express"

export const removeMeta = (req: Request, res: Response, next: NextFunction) => {
  if (req.body?.meta) {
    delete req.body.meta
    console.error("You aren't allow to update meta.")
  }

  next()
}
