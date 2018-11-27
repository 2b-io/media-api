import { FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PRESET')(
  async (req) => {
    const {
      contentType,
      projectIdentifier
    } = req.pathParameters

    const result = await projectService.preset.del(projectIdentifier, contentType.replace('_', '/'))

    if (!result) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: NO_CONTENT
    }
  }
)
