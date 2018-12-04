import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'

const SCHEMA = joi.object().keys({
  privilege: joi.string().trim().required()
})

export default resource('COLLABORATOR')(
  async (req, session) => {
    const {
      projectIdentifier,
      accountIdentifier: newOwner
    } = req.pathParameters

    const { account: currentOwner } = session

    if (!currentOwner) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const collaborators = await collaboratorService.replace(
      projectIdentifier,
      currentOwner,
      newOwner,
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
