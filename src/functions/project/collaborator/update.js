import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import accountService from 'services/account'
import collaboratorService from 'services/collaborator'
import sendEmailService from 'services/send-email'

const SCHEMA = joi.object().keys({
  emails: joi.array().items(
    joi.string().trim().required()
  ).required(),
  message: joi.string().trim()
})

export default resource('COLLABORATOR')(
  async (req, session) => {
    const { projectIdentifier } = req.pathParameters
    const { account: inviterAccount } = session

    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const { emails, message } = await joi.validate(body, SCHEMA)

    // Account list on the system
    const accounts = await accountService.list()

    // Filter the emails do not exist on the system
    const notExistedEmails = emails.filter(
      (email) => !accounts.some(
        (account) => account.email === email
      )
    )

    const collaborators = await collaboratorService.update(
      projectIdentifier,
      { emails, message }
    )

    if (!collaborators) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    //Sent email to invite
    await sendEmailService.invite(notExistedEmails, inviterAccount.name, inviterAccount.email, message)

    return {
      statusCode: OK,
      resource: collaborators
    }
  }
)
