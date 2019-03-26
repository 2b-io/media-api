import { NOT_FOUND, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import metricService from 'services/metric'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  startTime: joi.string().isoDate().required(),
  endTime: joi.string().isoDate().required(),
  period: joi.number().multiple(60).required(),
  from: joi.number().min(0),
  size: joi.number().min(0)
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('METRIC')(
  async (req) => {
    const { projectIdentifier, metricName } = req.pathParameters
    const params = req.queryStringParameters || {}

    const values = await joi.validate(params, SCHEMA)

    const dataPoints = await metricService.get(projectIdentifier, metricName, values)

    if (!dataPoints) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: dataPoints
    }
  }
))
