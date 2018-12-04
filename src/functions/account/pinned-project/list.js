import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import pinnedProjectService from 'services/pinned-project'

export default resource('PINNED_PROJECT')(
  async (req) => {
    const { accountIdentifier } = req.pathParameters
    // TODO: Authorization
    const pinnedProjects = await pinnedProjectService.list(accountIdentifier)

    if (!pinnedProjects) {
      return {
        statusCode: OK,
        resource: {
          projectIdentifiers: []
        }
      }
    }

    return {
      statusCode: OK,
      resource: pinnedProjects
    }
  }
)
