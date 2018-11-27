import uuid from 'uuid'

import createInfrastructureModel from 'models/infrastructure'
import jobService from 'services/job'
import projectService from 'services/project'

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
      projectIdentifier: data.projectIdentifier,
    }
  })

  return infrastructure
}

const get = async (projectIdentifier) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const Infrastructure = await createInfrastructureModel()

  return await Infrastructure.findOne({
    project: project._id
  })
}

const update = async (projectIdentifier, data) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const Infrastructure = await createInfrastructureModel()

  return await Infrastructure.findOneAndUpdate({
    project: project._id
  }, data, {
    new: true
  })
}

export default {
  create,
  get,
  update
}
