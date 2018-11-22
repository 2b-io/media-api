import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('project')(
  async (req) => {
    const projects = await projectService.list()

    return {
      statusCode: OK,
      resource: projects
    }
  }
)
