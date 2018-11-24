import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier, invalidationIdentifier } = req.pathParameters
    // TODO: validate
    const invalidation = await invalidationService.get(projectIdentifier, invalidationIdentifier)

    if (!invalidation) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: invalidation
    }
  }
)
