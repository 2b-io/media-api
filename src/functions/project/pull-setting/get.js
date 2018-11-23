import { NOT_FOUND, OK } from 'http-status-codes'

import resource from 'rest/resource'
import pullSettingServices from 'services/pull-setting'

export default resource('PULL_SETTING')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters

    const pullSetting = await pullSettingServices.get(projectIdentifier)

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
