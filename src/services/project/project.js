import namor from 'namor'
import uuid from 'uuid'

import createProjectModel from 'models/project'

import cacheSettingService from 'services/cache-setting'
import collaboratorService from 'services/collaborator'
import jobService from 'services/job'
import invalidationService from 'services/invalidation'
import infrastructureService from 'services/infrastructure'
import pullSettingService from 'services/pull-setting'

const generateUniqueIdentifier = async (retry) => {
  const identifier = namor.generate({
    words: 2,
    numbers: 2,
    manly: true
  })

  // check collision
  const project = await get(identifier)

  if (!project) {
    return identifier
  }

  // should retry?
  if (!retry) {
    throw 'Cannot create unique identifier'
  }

  // retry
  return await generateUniqueIdentifier(retry - 1)
}

const create = async ({ name, provider, owner }) => {
  const identifier = await generateUniqueIdentifier(10)

  const Project = await createProjectModel()

  const project = await new Project({
    name,
    identifier,
    status: 'INITIALIZING'
  }).save()

  // create related objects
  try {
    await collaboratorService.create({
      projectId: project._id,
      accountId: owner,
      privilege: 'OWNER'
    })

    await cacheSettingService.create({
      projectId: project._id
    })

    await pullSettingService.create({
      projectId: project._id
    })

    await infrastructureService.create({
      projectId: project._id,
      projectIdentifier: project.identifier,
      provider
    })

    return project
  } catch (e) {
    // rollback
    await project.remove()

    throw e
  }
}

const get = async (identifier, collaboratorId) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier,
    isDeleted: false
  })

  if (!project) {
    return null
  }

  if (collaboratorId) {
    const collaborator = await collaboratorService.get(project._id, collaboratorId)

    if (!collaborator) {
      return null
    }
  }

  return project
}

const list = async (condition = {}, collaboratorId) => {
  const collaborators = await collaboratorService.listByAccountId(collaboratorId)

  const Project = await createProjectModel()

  const projects = await Project.find({
    _id: {
      $in: collaborators.map((c) => c.project)
    },
    isDeleted: false,
    ...condition
  })

  return projects
}

const remove = async (projectIdentifier) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project || project.isActive) {
    return null
  }

  await jobService.create({
    name: 'CREATE_INVALIDATION',
    when: Date.now(),
    payload: {
      projectIdentifier
    }
  }, {
    messageId: uuid.v4()
  })

  return await Project.findOneAndUpdate({
    _id: project._id
  }, {
    isDeleted: true
  }, {
    new: true
  })
}

const update = async (projectIdentifier, data, collaboratorId) => {
  const current = await get(projectIdentifier, collaboratorId)

  if (!current) {
    return null
  }

  const Project = await createProjectModel()

  const updated = await Project.findOneAndUpdate({
    identifier: projectIdentifier
  }, {
    ...data,
    status: data.status || (
      current.isActive !== data.isActive ?
        'UPDATING' : current.status
    )
  }, {
    new: true
  })

  if (current.isActive !== updated.isActive) {
    await jobService.create({
      name: 'UPDATE_INFRASTRUCTURE',
      when: Date.now(),
      payload: {
        projectIdentifier,
        isActive: updated.isActive
      }
    })
  }

  return updated
}

export default {
  create,
  get,
  list,
  remove,
  update
}
