import { CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

const SCHEMA = joi.object().keys({
  patterns: joi.array().items(joi.string().required()).required()
})

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const invadidation = await invalidationService.create(
      projectIdentifier,
      { ...values }
    )

    if (!invadidation) {
      return {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: invadidation
    }
  }
)
