import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('project')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters

    const project = await projectService.get(projectIdentifier)

    if (!project) {
      statusCode: NOT_FOUND
    }

    return {
      statusCode: OK,
      resource: project
    }
  }
)
