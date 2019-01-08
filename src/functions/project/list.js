import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PROJECT')(
  async (req, session) => {
    const collaboratorId = session.account ?
      session.account._id : null

    const projects = await projectService.list({}, collaboratorId)

    return {
      statusCode: OK,
      resource: projects
    }
  }
))
