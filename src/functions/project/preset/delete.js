import { FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PRESET')(
  async (req) => {
    const {
      contentType,
      projectIdentifier
    } = req.pathParameters

    const result = await projectService.preset.del(projectIdentifier, decodeURIComponent(contentType))

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
