import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PRESET')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters

    const presets = await projectService.preset.list(projectIdentifier)

    if (!presets) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: presets
    }
  }
)
