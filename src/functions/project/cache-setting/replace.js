import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import cacheSettingService from 'services/cache-setting'

const SCHEMA = joi.object().keys({
  ttl: joi.number().min(0).required()
})

export default resource('CACHE_SETTING')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const cacheSetting = await cacheSettingService.replace(projectIdentifier, values)

    if (!cacheSetting) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: values
    }
  }
)
