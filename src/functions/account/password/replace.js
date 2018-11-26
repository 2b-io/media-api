import { BAD_REQUEST, FORBIDDEN, NO_CONTENT } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import passwordService from 'services/password'

const SCHEMA = joi.alternatives().try([
  joi.objects.key({
    token: joi.string().trim().required(),
    newPassword: joi.string().required()
  }),
  joi.objects.key({
    currentPassword: joi.string().required(),
    newPassword: joi.string().required()
  })
])

export default resource('ACCOUNT__PASSWORD')(
  async (req, session) => {
    const { accountIdentifier } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    if (!session.account || session.account.identifier !== accountIdentifier) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    const {
      token,
      currentPassword,
      newPassword
    } = values

    const result = currentPassword ?
      await passwordService.replaceByCurrentPassword(accountIdentifier, currentPassword, newPassword) :
      await passwordService.replaceByToken(accountIdentifier, token, newPassword)

    if (!result) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: NO_CONTENT
    }
  }
)
