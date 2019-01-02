import { NOT_IMPLEMENTED } from 'http-status-codes'

import resource from 'rest/resource'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource(
  async (req) => {
    return {
      statusCode: NOT_IMPLEMENTED
    }
  }
))
