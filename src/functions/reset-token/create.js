import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'

import resource from 'rest/resource'
import resetTokenService from 'services/reset-token'

export default resource('RESET_TOKEN')(
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

    return {
      statusCode: CREATED,
      resource: resetToken
    }
  }
)
