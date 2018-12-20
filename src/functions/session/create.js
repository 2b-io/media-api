import { CREATED, BAD_REQUEST } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import accountService from 'services/account'

const SCHEMA = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required()
})

export default resource('ACCOUNT')(
  async (req) => {
    const body = JSON.parse(req.body)
    const { email, password } = await joi.validate(body, SCHEMA)

    const accounts = await accountService.list({ email })

    if (accounts.length === 1 && accounts[ 0 ].comparePassword(password)) {
      return {
        statusCode: CREATED,
        resource: accounts[ 0 ]
      }
    }

    throw {
      statusCode: BAD_REQUEST
    }
  }
)
