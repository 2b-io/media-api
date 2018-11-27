import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import cacheSettingService from 'services/cache-setting'

export default resource('CACHE_SETTING')(
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
)
