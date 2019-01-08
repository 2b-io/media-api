import { OK, NOT_FOUND } from 'http-status-codes'

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
])(resource('FILE')(
  async (req) => {
    const { projectIdentifier, fileIdentifier } = req.pathParameters
    // TODO: Authorization
    const result = await projectService.file.head(
      projectIdentifier,
      decodeURIComponent(fileIdentifier)
    )

    if (!result) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK
    }
  }
))
