import uuid from 'uuid'

import jobService from 'services/job'

const invite = async (collaborators) => {
  const accountIdentifiers = collaborators.map(({ accountIdentifier }) => accountIdentifier)

  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'INVITATION',
      accountIdentifiers
    }
  }, {
    messageId: uuid.v4()
  })
}

const passwordRecovery = async (accountIdentifier) => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'PASSWORD_RECOVERY',
      accountIdentifier
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
