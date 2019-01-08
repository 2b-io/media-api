import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import invalidationService from 'services/invalidation'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('INVALIDATION')(
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
))
