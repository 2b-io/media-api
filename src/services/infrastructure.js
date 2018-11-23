import uuid from 'uuid'

import createInfrastructureModel from 'models/infrastructure'
import jobService from 'services/job'

const create = async (data) => {
  const Infrastructure = await createInfrastructureModel()

  const infrastructure = await new Infrastructure({
    project: data.projectId,
    provider: data.provider
  }).save()

  await jobService.create({
    name: 'CREATE_INFRASTRUCTURE',
    when: Date.now(),
    payload: {
      infrastructureIdentifier: infrastructure.identifier
    }
  }, {
    messageId: uuid.v4()
  })

  return infrastructure
}

export default {
  create
}
