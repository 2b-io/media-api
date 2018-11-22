import { OK } from 'http-status-codes'

import account from 'models/account'
import endpoint from 'rest/endpoint'

export default endpoint(
  async (req) => {
    const Account = await account()

    const accounts = await Account.find()

    return {
      statusCode: OK,
      resource: accounts
    }
  }
)
