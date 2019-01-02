import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  name: joi.string().max(50).trim().required(),
  provider: joi.any().valid('cloudfront').required()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PROJECT')(
  async (req, session) => {
    const body = JSON.parse(req.body) || {}

    // validation
    const values = await joi.validate(body, SCHEMA)

    if (!session.account) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    const project = await projectService.create({
      ...values,
      owner: session.account._id
    })

    return {
      statusCode: CREATED,
      resource: project
    }
  }
))
