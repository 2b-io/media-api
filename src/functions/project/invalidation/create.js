import { CREATED, NOT_ACCEPTABLE, BAD_REQUEST } from 'http-status-codes'

import resource from 'rest/resource'
import invadidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const { patterns } = JSON.parse(req.body)
    // TODO: validate
    if (!Array.isArray(patterns)) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    const newInvadidation = await invadidationService.create(
      projectIdentifier,
      patterns
    )

    if (!newInvadidation) {
      return {
        statusCode: NOT_ACCEPTABLE
      }
    }

    return {
      statusCode: CREATED,
      resource: newInvadidation
    }
  }
)
