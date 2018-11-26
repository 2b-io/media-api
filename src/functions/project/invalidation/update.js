import { BAD_REQUEST, FORBIDDEN, OK } from 'http-status-codes'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'

export default resource('INVALIDATION')(
  async (req) => {
    const { projectIdentifier, invalidationIdentifier } = req.pathParameters
    const { status, cdnInvalidationRef } = JSON.parse(req.body) || {}

    if (!status) {
      return {
        status: BAD_REQUEST
      }
    }

    // TODO: validate
    const invalidation = await invalidationService.update(projectIdentifier, invalidationIdentifier, {
      status,
      cdnInvalidationRef
    })

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
