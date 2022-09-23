import * as fs from 'fs'
import * as https from 'https'
import express from 'express'
import {errorHandler, writeError} from './error'
import {
  ApiVersion,
  mapRequestKindToResponseKind,
  Request,
  ResponseKind,
  validateRequest,
  validateResponse
} from './events'
import {handle} from './handle'
import expressBasicAuth from 'express-basic-auth'

export function serve(port: number, cert: string, key: string) {
  const app = express().disable('x-powered-by')

  app.use(express.json())

  const username = process.env.KETCH_USER_NAME || ''
  const password = process.env.KETCH_USER_PASSWORD || ''
  if (username.length && password.length) {
    app.use(
      expressBasicAuth({
        authorizer: (u: string, p: string): boolean => {
          return (
            expressBasicAuth.safeCompare(u, username) &&
            expressBasicAuth.safeCompare(p, password)
          )
        },
        unauthorizedResponse: (req: express.Request) => {
          const input: Request = req.body
          return {
            apiVersion: ApiVersion.V1,
            kind: ResponseKind.Error,
            metadata: input.metadata,
            error: {
              code: 403,
              status: 'forbidden',
              message: 'access denied'
            }
          }
        }
      })
    )
  } else {
    console.warn(
      '⚠️ Starting server without authentication. Not recommended for production use.'
    )
  }

  app.post('/ketch/events', (req, res) => {
    const input: Request = req.body

    try {
      const r = validateRequest(input)

      res
        .status(200)
        .contentType('application/json')
        .json(
          validateResponse({
            apiVersion: r.apiVersion,
            kind: mapRequestKindToResponseKind(r.kind),
            metadata: r.metadata,
            response: handle(r)
          })
        )
    } catch (e: any) {
      writeError(res, e, input.metadata)
    }
  })

  app.use(errorHandler)

  const serverOptions: https.ServerOptions = {
    // Certificate(s) & Key(s)
    cert: fs.readFileSync(cert),
    key: fs.readFileSync(key),

    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.2'
  }

  https.createServer(serverOptions, app).listen(port)
}
