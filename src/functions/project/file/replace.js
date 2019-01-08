import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  originUrl: joi.string().allow(null).trim(),
  expires: joi.string().isoDate(),
  isOrigin: joi.boolean(),
  lastModified: joi.string().isoDate(),
  lastSynchronized: joi.string().isoDate()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('FILE')(
  async (req) => {
    const { projectIdentifier, fileIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const file = await projectService.file.replace(
      projectIdentifier,
      decodeURIComponent(fileIdentifier),
      values
    )

    if (!file) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: file
    }
  }
))
