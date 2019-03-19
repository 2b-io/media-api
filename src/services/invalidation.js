import uuid from 'uuid'

import createInvalidationModel from 'models/invalidation'
import jobService from 'services/job'
import createProjectModel from 'models/project'

const create = async (projectIdentifier, { patterns = [] }) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier,
    isDeleted: false
  })

  if (!project) {
    return null
  }

  const Invalidation = await createInvalidationModel()

  const invadidation = await new Invalidation({
    project: project._id,
    patterns,
    status:'INPROGRESS'
  }).save()

  if (invadidation) {
    await jobService.create({
      name: 'CREATE_INVALIDATION',
      when: Date.now(),
      payload: {
        projectIdentifier,
        invalidationIdentifier: invadidation.identifier
      }
    }, {
      messageId: uuid.v4()
    })
  }

  return invadidation
}

const get = async (projectIdentifier, invalidationIdentifier) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier,
    isDeleted: false
  })

  if (!project) {
    return null
  }

  const Invalidation = await createInvalidationModel()
  console.log('invalidationIdentifier', invalidationIdentifier)
  console.log('project._id', project._id)
  const invalidation = await Invalidation.findOne({
    identifier: invalidationIdentifier,
    project: project._id
  })
  console.log('invalidation', invalidation)
  return invalidation
}

const list = async (projectIdentifier, condition = {}) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier,
    isDeleted: false
  })

  if (!project) {
    return null
  }

  const Invalidation = await createInvalidationModel()

  return await Invalidation.find({
    project: project._id,
    ...condition
  })
}

const update = async (projectIdentifier, invalidationIdentifier, data) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier,
    isDeleted: false
  })

  if (!project) {
    return null
  }

  const Invalidation = await createInvalidationModel()

  return await Invalidation.findOneAndUpdate({
    identifier: invalidationIdentifier,
    project: project._id
  }, data, {
    new: true
  })
}

export default {
  create,
  get,
  list,
  update
}
