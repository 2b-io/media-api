import { NOT_FOUND, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import metricService from 'services/metric'

const SCHEMA = joi.object().keys({
  startTime: joi.string().isoDate().required(),
  endTime: joi.string().isoDate().required(),
  period: joi.number().multiple(60).required()
})

export default resource('METRIC')(
  async (req) => {
    const { projectIdentifier, metricName } = req.pathParameters
    const params = req.queryStringParameters || {}

    const values = await joi.validate(params, SCHEMA)

    const listMetricData = await metricService.get(projectIdentifier, metricName, values)

    if (!listMetricData) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: listMetricData
    }
  }
)
