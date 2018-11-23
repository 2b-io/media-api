import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import invadidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier, invalidationIdentifier } = req.pathParameters
    const data = JSON.parse(req.body) || {}
    // TODO: validate
    const invalidations = await invadidationService.update(
      projectIdentifier,
      invalidationIdentifier,
      data
    )

    if (!invalidations) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: invalidations
    }
  }
)
