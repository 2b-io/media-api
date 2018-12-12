import { FORBIDDEN, NO_CONTENT} from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier, fileIdentifier } = req.pathParameters
    // TODO: Authorization
    const result = await projectService.file.remove(
      projectIdentifier,
      decodeURIComponent(fileIdentifier)
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
)
