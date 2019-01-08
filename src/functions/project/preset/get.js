import { NOT_FOUND, OK } from 'http-status-codes'

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

    const preset = await projectService.preset.get(projectIdentifier, decodeURIComponent(contentType))

    if (!preset) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: preset
    }
  }
))
