import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import pullSettingService from 'services/pull-setting'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PULL_SETTING')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: validate
    const pullSetting = await pullSettingService.get(projectIdentifier)

    if (!pullSetting) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: pullSetting
    }
  }
))
