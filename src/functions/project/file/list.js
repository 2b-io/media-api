import { OK, NOT_FOUND } from 'http-status-codes'
import queryString from 'querystring'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO Authorization
    const params = queryString.stringify(req.queryStringParameters)
    const options = queryString.parse(params)

    const files = await projectService.file.list(projectIdentifier, options)

    if (!files) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: files
    }
  }
)
