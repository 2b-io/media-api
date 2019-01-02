import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import infrastructureService from 'services/infrastructure'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('INFRASTRUCTURE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters

    const infrastructure = await infrastructureService.get(projectIdentifier)

    if (!infrastructure) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: infrastructure
    }
  }
))
