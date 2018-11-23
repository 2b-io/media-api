import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PROJECT')(
  async (req, session) => {
    const collaboratorId = session.account ?
      session.account._id : null

    const projects = await projectService.list({}, collaboratorId)

    return {
      statusCode: OK,
      resource: projects
    }
  }
)
