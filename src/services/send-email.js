import uuid from 'uuid'

import config from 'infrastructure/config'
import jobService from 'services/job'
import resetTokenService from 'services/reset-token'

const invite = async (collaborators, inviterName, message) => {
  const accountIdentifiers = collaborators.map(async ({ accountIdentifier }) => {
    const { token } = await resetTokenService.getByAccountIdentifier(accountIdentifier)

    await jobService.create({
      name: 'SEND_EMAIL',
      when: Date.now(),
      payload: {
        type: 'INVITATION',
        accountIdentifier,
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
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'PASSWORD_RECOVERY',
      accountIdentifier,
      resetLink: `${ config.webappUrl }/reset-password/${ token }`
    }
  }, {
    messageId: uuid.v4()
  })
}

const welcome = async (accountIdentifier, token) => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'WELCOME',
      accountIdentifier,
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
