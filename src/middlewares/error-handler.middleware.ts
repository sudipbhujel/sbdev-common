import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

import { CustomError } from "../errors/custom.error"

interface IError extends Error {
  code?: number
  keyPattern?: any
  response?: any
}

export const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    let errors = []
    for (const field in err.errors) {
      errors.push({ message: err.errors[field].message, field })
    }
    return res.status(400).send({ errors })
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).send({
      // errors: [{ message: err.reason?.message }],
      errors: [{ message: "Couldn't find in database" }],
    })
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern)

    return res.status(400).send({
      errors: [
        fields.map((field) => ({
          message: `Already exist in database`,
          field,
        })),
      ],
    })
  }

  if (err.response?.request?.host === "api.sparrowsms.com") {
    return res.status(400).send({
      errors: [
        {
          message: err?.response.data.response,
        },
      ],
    })
  }

  console.log(err)
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  })
}
