import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'

import resource from 'rest/resource'
import resetTokenService from 'services/reset-token'
import sendEmailService from 'services/send-email'
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
    const { email } = JSON.parse(req.body) || {}

    if (!email) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    const resetToken = await resetTokenService.create({ email })

    if (!resetToken) {
      return {
        statusCode: FORBIDDEN
      }
    }

    await sendEmailService.passwordRecovery(resetToken.accountIdentifier, resetToken.token)

    return {
      statusCode: CREATED,
      resource: resetToken
    }
  }
))
