import { CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  key: joi.string().trim().required(),
  contentType: joi.string().trim().required(),
  contentLength: joi.number().required(),
  originUrl: joi.string().trim(),
  preset: joi.string().allow(null).trim(),
  expires: joi.date(),
  isOrigin: joi.boolean(),
  lastModified: joi.date(),
  lastSynchronized: joi.date()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('FILE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const file = await projectService.file.create(
      projectIdentifier,
      values.key,
      values
    )

    if (!file) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: file
    }
  }
))
