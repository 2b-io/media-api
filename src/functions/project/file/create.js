import { CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import fileService from 'services/file'

const SCHEMA = joi.object().keys({
  key: joi.string().trim().required(),
  contentType: joi.string().trim().required(),
  contentLength: joi.number().required(),
  originUrl: joi.string().trim(),
  preset: joi.string().trim().required(),
  expires: joi.date(),
  isOrigin: joi.boolean(),
  lastModified: joi.date(),
  lastSynchronized: joi.date()
})

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)
    const file = await fileService.create(projectIdentifier, values.key, values)

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
)
