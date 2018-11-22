import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('account')(
  async (req) => {
    const { accountIdentifier } = req.pathParameters

    const account = await accountService.get(accountIdentifier)

    if (!account) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: account
    }
  }
)
