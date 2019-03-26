import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import metricService from 'services/metric'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.array().items(
  joi.object().keys({
    timestamp: joi.string().isoDate().required(),
    value: joi.number().required(),
    isUpdate: joi.boolean()
  })
)

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('METRIC')(
  async (req) => {
    const { projectIdentifier, metricName } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const metricData = await metricService.update(projectIdentifier, metricName, values)

    if (!metricData.length) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: metricData
    }
  }
))
