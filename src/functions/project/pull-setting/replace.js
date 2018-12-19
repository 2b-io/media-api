import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import pullSettingService from 'services/pull-setting'

const SCHEMA = joi.object().keys({
  pullUrl: joi.string().allow('').trim(),
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

export default resource('PULL_SETTING')(
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
)
