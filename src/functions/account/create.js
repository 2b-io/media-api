import { CREATED, CONFLICT } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'

export default resource('ACCOUNT')(
  async (req) => {
    const { email } = JSON.parse(req.body)

    const newAccount = await accountService.create({ email })

    if (!newAccount) {
      return {
        statusCode: CONFLICT
      }
    }

    return {
      statusCode: CREATED,
      resource: newAccount
    }
  }
)
