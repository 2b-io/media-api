import { BAD_REQUEST, FORBIDDEN, NO_CONTENT } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import passwordService from 'services/password'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.alternatives().try([
  joi.object().keys({
    token: joi.string().trim().required(),
    newPassword: joi.string().required()
  }),
  joi.object().keys({
    currentPassword: joi.string().required(),
    newPassword: joi.string().required()
  })
])

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('ACCOUNT__PASSWORD')(
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
))
