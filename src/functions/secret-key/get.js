import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import secretKeyService from 'services/secret-key'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('SECRET_KEY')(
  async (req) => {
    const { key } = req.pathParameters
    const secretKey = await secretKeyService.get(key)

    if (!secretKey) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: secretKey
    }
  }
))
