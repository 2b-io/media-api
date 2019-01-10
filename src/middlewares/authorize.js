import {
  UNAUTHORIZED
} from 'http-status-codes'
import middy from 'middy'

import secretKeyService from 'services/secret-key'
import { normalizeHttpHeaders, parseAuthorizationHeader } from 'utils/header'

const auth = (allowApps) => {
  return {
    before: async (handler) => {
      const { authorization } = normalizeHttpHeaders(handler.event.headers)

      if (!authorization) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      const {
        type,
        app,
      } = parseAuthorizationHeader(authorization)

      if (type !== 'MEDIA_CDN') {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      const secretKey = await secretKeyService.get(app)

      if (!secretKey) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      if (allowApps.indexOf(secretKey.app) < 0) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }
    },
    onError: async (handler) => {
      handler.response = {
        statusCode: handler.error.statusCode,
        body: JSON.stringify({
          reason: handler.error.details
        })
      }
    }
  }
}

export default (allowApps) => (handler) => {
  return middy(handler).use(auth(allowApps))
}
