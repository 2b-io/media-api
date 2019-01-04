import { FORBIDDEN, NOT_FOUND, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import accountService from 'services/account'

const SCHEMA = joi.object().keys({
  name: joi.string().max(50).trim().required()
})

export default resource('ACCOUNT')(
  async (req, session) => {
    const { accountIdentifier } = req.pathParameters

    const account = await accountService.get(accountIdentifier)

    if (!account) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    if (!session.account || session.account.identifier !== account.identifier) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    const body = JSON.parse(req.body)
    const values = await joi.validate(body, SCHEMA)

    const updatedAccount = await accountService.update(accountIdentifier, values)

    return {
      statusCode: OK,
      resource: updatedAccount
    }
  }
)
