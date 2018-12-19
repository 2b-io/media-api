import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('ACCOUNT')(
  async (req) => {
    const {
      password,
      email,
      ...params
    } = req.queryStringParameters || {}
    const accounts = await accountService.list({
      email: decodeURIComponent(email),
      ...params
    })

    if (password && accounts.length === 1) {
      const passwordDecoded = Buffer.from(decodeURIComponent(password), 'base64').toString('ascii')
      console.log('accounts', accounts);
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
