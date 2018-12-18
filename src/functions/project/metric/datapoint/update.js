import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import metricService from 'services/metric'

const SCHEMA = joi.array().items(
  joi.object().keys({
    timestamp: joi.number().required(),
    value: joi.number().required()
  })
)

export default resource('METRIC')(
  async (req) => {
    const { projectIdentifier, metricName } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const metricData = await metricService.update(projectIdentifier, metricName, values)

    if (!metricData) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK
    }
  }
)
