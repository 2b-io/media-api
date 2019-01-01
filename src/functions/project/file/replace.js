import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const SCHEMA = joi.object().keys({
  originUrl: joi.string().allow(null).trim(),
  expires: joi.string().isoDate(),
  isOrigin: joi.boolean(),
  lastModified: joi.string().isoDate(),
  lastSynchronized: joi.string().isoDate()
})

export default resource('FILE')(
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
)
