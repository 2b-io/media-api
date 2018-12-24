import { OK, NOT_FOUND } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const SCHEMA = joi.alternatives().try([
  joi.object().keys({
    pattern: joi.string().trim()
  }),
  joi.object().keys({
    preset: joi.string().trim()
  }),
  joi.object().keys({
    contentType: joi.string().trim()
  })
])

export default resource('FILE')(
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
)
