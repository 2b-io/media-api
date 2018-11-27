import { CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const SCHEMA = joi.object().keys({
  contentType: joi.any().valid([
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/svg+xml'
  ]).required()
})

export default resource('PRESET')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const preset = await projectService.preset.create(projectIdentifier, values)

    if (!preset) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: preset
    }
  }
)
