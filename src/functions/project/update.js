import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.alternatives().try([
  joi.object().keys({
    name: joi.string().max(50).trim().required(),
    isActive: joi.boolean().required()
  }),
  joi.object().keys({
    status: joi.any().valid('DEPLOYED', 'DISABLED').required(),
  })
])

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('PROJECT')(
  async (req, session) => {
    const { projectIdentifier } = req.pathParameters
    const collaboratorId = session.account ?
      session.account._id : null
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const project = await projectService.update(projectIdentifier, values, collaboratorId)

    if (!project) {
      throw {
        status: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: project
    }
  }
))
