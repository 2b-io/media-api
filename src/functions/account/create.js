import { CREATED, CONFLICT } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import accountService from 'services/account'
import sendEmailService from 'services/send-email'

const SCHEMA = joi.object().keys({
  email: joi.string().email().required()
})

export default resource('ACCOUNT')(
  async (req) => {
    const body = JSON.parse(req.body)
    const values = await joi.validate(body, SCHEMA)

    const newAccount = await accountService.create(values)

    if (!newAccount) {
      throw {
        statusCode: CONFLICT
      }
    }

    await sendEmailService.welcome(newAccount.identifier, newAccount.email)

    return {
      statusCode: CREATED,
      resource: newAccount
    }
  }
)
