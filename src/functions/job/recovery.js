import { OK, NOT_FOUND } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import jobService from 'services/job'

const SCHEMA = joi.object().keys({
  maxJobs: joi.number().min(0).required()
})

export default resource('JOB_SNAPSHOT')(
  async (req) => {
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const jobs = await jobService.recovery(values)

    if (!jobs) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: jobs
    }
  }
)
