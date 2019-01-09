import {
  UNAUTHORIZED
} from 'http-status-codes'
import middy from 'middy'

import secretKeyService from 'services/secret-key'
import { normalizeHttpHeaders, parseAuthorizationHeader } from 'utils/header'

const auth = (allowApps) => {
  return {
    before: async (handler, next) => {
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
      console.log('secretKey', secretKey);
      console.log('app', app);

      if (!secretKey) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }
      console.log('kkkkk');
      if (allowApps.indexOf(secretKey.app) < 0) {
        throw {
          statusCode: UNAUTHORIZED
        }
      }

      return next()
    },
    onError: (handler, next) => {
      console.log('handler', handler)

      handler.response = {
        statusCode: handler.error.statusCode,
        body: JSON.stringify({
          reason: handler.error.details
        })
      }

      return next()
    }
  }
}

export default (allowApps) => (handler) => {
  // return middy(handler).use(auth(allowApps))
  return handler
}
