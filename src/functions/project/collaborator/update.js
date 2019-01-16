import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import accountService from 'services/account'
import collaboratorService from 'services/collaborator'
import sendEmailService from 'services/send-email'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  emails: joi.array().items(
    joi.string().lowercase().email().required()
  ).required(),
  message: joi.string().trim()
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('COLLABORATOR')(
  async (req, session) => {
    const { projectIdentifier } = req.pathParameters
    const { account: inviterAccount } = session

    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const {
      emails: inputEmails,
      message
    } = await joi.validate(body, SCHEMA)

    // remove duplicate emails in list
    const emails = [ ...new Set(inputEmails) ]

    const accounts = await accountService.list({ email: { '$in': emails } })

    // Filter the emails do not exist on the system
    const notExistedEmails = emails.filter(
      (email) => !accounts.some(
        (account) => account.email === email
      )
    )

    const collaborators = await collaboratorService.update(projectIdentifier, emails)

    if (!collaborators) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    // Sent email to invite
    await sendEmailService.invite(notExistedEmails, inviterAccount.name, inviterAccount.email, message)

    return {
      statusCode: OK,
      resource: collaborators
    }
  }
))
