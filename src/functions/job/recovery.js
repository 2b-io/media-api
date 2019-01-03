import { OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import jobService from 'services/job'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  maxJobs: joi.number().min(0).required()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('JOB_RECOVERY')(
  async (req) => {
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const hits = await jobService.recovery(values)

    return {
      statusCode: OK,
      resource: hits
    }
  }
))
