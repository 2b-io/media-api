import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import resetTokenService from 'services/reset-token'

export default resource('RESET_TOKEN')(
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
)
