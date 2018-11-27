import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: Authorization
    const invalidations = await invalidationService.list(projectIdentifier)

    if (!invalidations) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: invalidations
    }
  }
)
