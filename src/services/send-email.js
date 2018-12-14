import uuid from 'uuid'

import jobService from 'services/job'

const invite = async (collaborators, inviterName, message) => {
  console.log('aaaaaaa');
  const accountIdentifiers = collaborators.map(async ({ accountIdentifier }) => {
    await jobService.create({
      name: 'SEND_EMAIL',
      when: Date.now(),
      payload: {
        type: 'INVITATION',
        accountIdentifier,
        inviterName,
        message
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
      token
    }
  }, {
    messageId: uuid.v4()
  })
}

const welcome = async (accountIdentifier) => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'WELCOME',
      accountIdentifier
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
