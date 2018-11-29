import { FORBIDDEN, NO_CONTENT } from 'http-status-codes'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'

export default resource('COLLABORATOR')(
  async (req) => {
    const {
      projectIdentifier,
      accountIdentifier
    } = req.pathParameters
    // TODO: Authorization
    const result = await collaboratorService.remove(
      projectIdentifier,
      accountIdentifier
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
