import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('ACCOUNT')(
  async (req) => {
    const {
      password,
      ...params
    } = req.queryStringParameters || {}

    const accounts = await accountService.list(params)

    if (password && accounts.length === 1) {
      const passwordDecoded = Buffer.from(decodeURIComponent(password), 'base64').toString('ascii')

      return {
        statusCode: OK,
        resource: accounts[ 0 ].comparePassword(passwordDecoded) ? accounts : []
      }
    }
    return {
      statusCode: OK,
      resource: accounts
    }
  }
)
