import { CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  patterns: joi.array().items(
    joi.string().trim().required()
  ).required()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const invadidation = await invalidationService.create(projectIdentifier, values)

    if (!invadidation) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: invadidation
    }
  }
))
