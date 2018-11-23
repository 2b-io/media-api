import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('ACCOUNT')(
  async (req, session) => {
    const { accountIdentifier } = req.pathParameters

    const account = await accountService.get(accountIdentifier)

    if (!account) {
      return {
        statusCode: NOT_FOUND
      }
    }

    if (!session.account || session.account.identifier !== account.identifier) {
      return {
        statusCode: FORBIDDEN
      }
    }

    const { name } = JSON.parse(req.body) || {}

    if (!name) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    const updatedAccount = await accountService.update(accountIdentifier, {
      name
    })

    return {
      statusCode: OK,
      resource: updatedAccount
    }
  }
)
