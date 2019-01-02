import { BAD_REQUEST, CREATED } from 'http-status-codes'
import joi from 'joi'
import uuid from 'uuid'

import resource from 'rest/resource'
import jobService from 'services/job'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  name: joi.string().trim().required(),
  when: joi.date().required(),
  payload: joi.object()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('JOB')(
  async (req, session) => {
    const body = JSON.parse(req.body)
    const values = await joi.validate(body, SCHEMA)
    const identifier = uuid.v4()

    const job = await jobService.create(values, {
      appId: session.app,
      messageId: identifier
    })

    return {
      statusCode: CREATED,
      resource: {
        identifier,
        ...job
      }
    }
  }
))
