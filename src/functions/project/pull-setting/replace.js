import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import pullSettingService from 'services/pull-setting'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  allowedOrigins: joi.array().items(
    joi.string().trim()
  ),
  headers: joi.array().items(
    joi.object().keys({
      name: joi.string().trim().required(),
      value: joi.string().trim()
    })
  )
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PULL_SETTING')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const pullSetting = await pullSettingService.replace(projectIdentifier, values)

    if (!pullSetting) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: pullSetting
    }
  }
))
