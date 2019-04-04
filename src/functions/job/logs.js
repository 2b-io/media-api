import { OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import jobService from 'services/job'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  time: joi.string().isoDate().required(),
  state: joi.string().required(),
  lastState: joi.string().required(),
  lastTime: joi.string().isoDate().required()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('JOB_LOG')(
  async (req) => {
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const result = await jobService.logs(values)

    return {
      statusCode: OK,
      resource: result
    }
  }
))
