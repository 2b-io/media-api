import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import pullSettingService from 'services/pull-setting'

export default resource('PULL_SETTING')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: validate
    const pullSetting = await pullSettingService.get(projectIdentifier)

    if (!pullSetting) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: pullSetting
    }
  }
)
