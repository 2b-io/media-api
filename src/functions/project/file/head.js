import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier, fileIdentifier } = req.pathParameters
    // TODO: Authorization
    const result = await projectService.file.head(
      projectIdentifier,
      decodeURIComponent(fileIdentifier)
    )

    if (!result) {
      statusCode: NOT_FOUND
    }

    return {
      statusCode: OK
    }
  }
)
