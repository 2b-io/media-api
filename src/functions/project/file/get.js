import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import fileService from 'services/file'

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier, fileIdentifier } = req.pathParameters
    // TODO: Authorization
    const file = await fileService.get(projectIdentifier, fileIdentifier)

    if (!file) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: file
    }
  }
)
