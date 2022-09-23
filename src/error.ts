import {NextFunction, Request, Response} from 'express'
import {ApiVersion, Metadata, ResponseKind} from './events'
import {ZodError} from 'zod'

export function writeError(
  res: Response,
  err: any,
  metadata: Metadata = {uid: '', tenant: ''}
) {
  let code = 500
  let status = 'unavailable'
  let message = err.message
  if (err.name === 'ZodError') {
    const zodError: ZodError = err
    code = 400
    status = 'invalid'
    message = zodError.errors
      .map(value => `${value.path.join('.')}: ${value.message}`)
      .join('; ')
  }

  res
    .status(code || 500)
    .contentType('application/json')
    .send({
      apiVersion: ApiVersion.V1,
      kind: ResponseKind.Error,
      metadata: metadata,
      error: {
        code,
        status,
        message
      }
    })
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err)
  }

  writeError(res, err)
}
