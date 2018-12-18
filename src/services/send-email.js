import uuid from 'uuid'

import config from 'infrastructure/config'
import jobService from 'services/job'
import accountService from 'services/account'
import resetTokenService from 'services/reset-token'

const invite = async (collaborators, inviterName, message) => {
  const accountIdentifiers = collaborators.map(async ({ accountIdentifier }) => {
    const { token } = await resetTokenService.getByAccountIdentifier(accountIdentifier)
    const { email } = await accountService.get(accountIdentifier)

    await jobService.create({
      name: 'SEND_EMAIL',
      when: Date.now(),
      payload: {
        type: 'INVITATION',
        email,
        inviterName,
        message,
        activateLink: `${ config.webappUrl }/reset-password/${ token }`
      }
    }, {
      messageId: uuid.v4()
    })
  })
}

const passwordRecovery = async (accountIdentifier, token) => {
  const { email, name } = await accountService.get(accountIdentifier)

  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'PASSWORD_RECOVERY',
      email,
      accountName: name,
      resetLink: `${ config.webappUrl }/reset-password/${ token }`
    }
  }, {
    messageId: uuid.v4()
  })
}

const welcome = async (accountIdentifier, token) => {
  const { email } = await accountService.get(accountIdentifier)

  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'WELCOME',
      email,
      activateLink: `${ config.webappUrl }/reset-password/${ token }`
    }
  }, {
    messageId: uuid.v4()
  })
}

export default {
  invite,
  passwordRecovery,
  welcome
}
