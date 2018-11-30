import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'

const SCHEMA = joi.object().keys({
  privilege: joi.string().trim().required()
})

export default resource('COLLABORATOR')(
  async (req) => {
    const { projectIdentifier, accountIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const collaborators = await collaboratorService.replace(
      projectIdentifier,
      accountIdentifier,
      values
    )

    if (!collaborators) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: collaborators
    }
  }
)
