import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

import head from './head'

export default resource('FILE')(
  async (req) => {
    if (req.httpMethod === 'HEAD') {
      return await head.logic(req)
    }

    const { projectIdentifier, fileIdentifier } = req.pathParameters
    // TODO: Authorization
    const file = await projectService.file.get(
      projectIdentifier,
      decodeURIComponent(fileIdentifier)
    )

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
