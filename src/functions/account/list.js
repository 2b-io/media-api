import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('ACCOUNT')(
  async (req) => {
    const params = req.queryStringParameters || {}
    const accounts = await accountService.list(params)

    if (!accounts) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: accounts
    }
  }
)
