import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PRESET')(
  async (req) => {
    const {
      contentType,
      projectIdentifier
    } = req.pathParameters

    const preset = await projectService.preset.get(projectIdentifier, contentType.replace('_', '/'))

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
)
