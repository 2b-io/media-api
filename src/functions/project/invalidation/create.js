import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'

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

    const invadidation = await invalidationService.create(projectIdentifier, {
      patterns
    })

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
