import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'

export default resource('COLLABORATOR')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: Authorization
    const collaborators = await collaboratorService.listByProjectIdentifier(projectIdentifier)

    if (!collaborators) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: collaborators
    }
  }
)
