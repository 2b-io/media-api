import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('account')(
  async (req) => {
    const accounts = await accountService.list()

    return {
      statusCode: OK,
      resource: accounts
    }
  }
)
