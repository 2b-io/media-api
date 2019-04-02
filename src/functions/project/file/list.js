import { OK, NOT_FOUND } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.alternatives().try([
  joi.object().keys({
    pattern: joi.string().trim()
  }),
  joi.object().keys({
    preset: joi.string().trim()
  }),
  joi.object().keys({
    contentType: joi.string().trim()
  }),
  joi.object().keys({
    lastSynchronized: joi.string().isoDate().required(),
    from: joi.number().min(0),
    size: joi.number().min(0).max(500)
  }),
])

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('FILE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const params = req.queryStringParameters || {}
    // TODO: Authorization
    const values = await joi.validate(params, SCHEMA)

    const files = await projectService.file.list(projectIdentifier, values)

    if (!files) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: files
    }
  }
))
