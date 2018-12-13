import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import collaboratorService from 'services/collaborator'
import sendEmailService from 'services/send-email'

const SCHEMA = joi.object().keys({
  emails: joi.array().items(
    joi.string().trim().required()
  ).required(),
  message: joi.string().trim()
})

export default resource('COLLABORATOR')(
  async (req) => {
    const { accountIdentifier, projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const collaborators = await collaboratorService.update(
      projectIdentifier,
      values
    )

    if (!collaborators) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    await sendEmailService.invite(collaborators)

    return {
      statusCode: OK,
      resource: collaborators
    }
  }
)
