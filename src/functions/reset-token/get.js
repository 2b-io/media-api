import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import resetTokenService from 'services/reset-token'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('RESET_TOKEN')(
  async (req) => {
    const { token } = req.pathParameters

    const resetToken = await resetTokenService.get(token)

    if (!resetToken) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: resetToken
    }
  }
))
