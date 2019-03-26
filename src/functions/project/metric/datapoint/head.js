import { OK, NOT_FOUND } from 'http-status-codes'

import resource from 'rest/resource'
import metricService from 'services/metric'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('METRIC')(
  async (req) => {
    const { projectIdentifier, metricName, timestamp } = req.pathParameters

    const result = await metricService.head(projectIdentifier, metricName, decodeURIComponent(timestamp))

    if (!result) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK
    }
  }
))
