import { FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PROJECT')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: Authorization
    const result = await projectService.remove(projectIdentifier)

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
