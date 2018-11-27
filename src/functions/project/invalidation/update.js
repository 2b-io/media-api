import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

const SCHEMA = joi.alternatives().try([
  joi.object().keys({
    status: joi.any().valid([
      'INPROGRESS',
      'COMPLETED'
    ]).required()
  }),
  joi.object().keys({
    cdnInvalidationRef: joi.string().trim().required()
  })
])

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier, invalidationIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

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
