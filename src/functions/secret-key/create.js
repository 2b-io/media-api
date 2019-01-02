import { CREATED } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import secretKeyService from 'services/secret-key'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  title: joi.string().required(),
  description: joi.string(),
  app: joi.string().required()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('SECRET_KEY')(
  async (req) => {
    const body = JSON.parse(req.body)
    const values = await joi.validate(body, SCHEMA)

    const secretKey = await secretKeyService.create({
      ...values,
    })

    return {
      statusCode: CREATED,
      resource: secretKey
    }
  }
))
