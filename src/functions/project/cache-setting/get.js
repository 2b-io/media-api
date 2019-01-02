import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import cacheSettingService from 'services/cache-setting'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('CACHE_SETTING')(
  async (req, session) => {
    const { projectIdentifier } = req.pathParameters
    const cacheSetting = await cacheSettingService.get(projectIdentifier)

    if (!cacheSetting) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: cacheSetting
    }
  }
))
