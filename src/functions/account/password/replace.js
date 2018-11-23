import { BAD_REQUEST, FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import passwordService from 'services/password'

export default resource('PASSWORD')(
  async (req, session) => {
    const { accountIdentifier } = req.pathParameters
    const {
      currentPassword,
      newPassword,
      token
    } = JSON.parse(req.body) || {}

    if (!newPassword || !(currentPassword || token)) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    if (!session.account || session.account.identifier !== accountIdentifier) {
      return {
        statusCode: FORBIDDEN
      }
    }

    const result = currentPassword ?
      await passwordService.replaceByCurrentPassword(accountIdentifier, currentPassword, newPassword) :
      await passwordService.replaceByToken(accountIdentifier, token, newPassword)

    if (!result) {
      return {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: NO_CONTENT
    }
  }
)
