import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

const SCHEMA = joi.object().keys({
  status: joi.string().trim().required(),
  cdnInvalidationRef: joi.string().trim(),
})

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier, invalidationIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}

    const values = await joi.validate(body, SCHEMA)

    // TODO: validate
    const invalidation = await invalidationService.update(
      projectIdentifier,
      invalidationIdentifier,
      values
    )

    if (!invalidation) {
      return {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: invalidation
    }
  }
)
