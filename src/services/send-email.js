import uuid from 'uuid'

import jobService from 'services/job'

const invite = async (userName) => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'INVITATION',
      userName
    }
  }, {
    messageId: uuid.v4()
  })
}

const passwordRecovery = async () => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'PASSWORD_RECOVERY'
    }
  }, {
    messageId: uuid.v4()
  })
}

const welcome = async () => {
  await jobService.create({
    name: 'SEND_EMAIL',
    when: Date.now(),
    payload: {
      type: 'WELCOME'
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
