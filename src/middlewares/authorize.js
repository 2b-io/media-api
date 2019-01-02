import {
  UNAUTHORIZED
} from 'http-status-codes'
import middy from 'middy'

import { normalizeHttpHeaders, parseAuthorizationHeader } from 'utils/header'
import config from 'infrastructure/config'

const auth = (allowApps) => {
  return ({
    before: (handler, next) => {
      const { authorization } = normalizeHttpHeaders(handler.event.headers)

      if (!authorization) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      const {
        type,
        app,
        account: accountIdentifier,
      } = parseAuthorizationHeader(authorization)

      if (type !== 'MEDIA_CDN') {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      // TODO hardcode into config. Move to database after confirm idea
      const service = config.services.find(service => service.secret === app)

      if (!service) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      if (allowApps.indexOf(service.app) < 0) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      return next()
    },
  })
}

export default allowApps => handler => {
  return middy(handler).use(auth(allowApps))
}
