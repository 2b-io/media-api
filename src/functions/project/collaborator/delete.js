import { FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('COLLABORATOR')(
  async (req) => {
    const {
      projectIdentifier,
      accountIdentifier
    } = req.pathParameters
    // TODO: Authorization
    const result = await collaboratorService.remove(
      projectIdentifier,
      accountIdentifier
    )

    if (!result) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: NO_CONTENT
    }
  }
))
