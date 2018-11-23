import { CREATED, FORBIDDEN, BAD_REQUEST } from 'http-status-codes'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const { patterns } = JSON.parse(req.body) || {}
    // TODO: validate
    if (!patterns || !Array.isArray(patterns)) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    const newInvadidation = await invalidationService.create(
      projectIdentifier,
      patterns
    )

    if (!newInvadidation) {
      return {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: newInvadidation
    }
  }
)
