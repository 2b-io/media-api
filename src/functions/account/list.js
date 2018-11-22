import { OK } from 'http-status-codes'

import endpoint from 'rest/endpoint'
import accountService from 'services/account'

export default endpoint(
  async (req) => {
    const accounts = await accountService.list()

    return {
      statusCode: OK,
      resource: accounts
    }
  }
)
