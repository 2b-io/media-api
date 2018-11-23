import namor from 'namor'

import createProjectModel from 'models/project'
import cacheSettingService from 'services/cache-setting'
import collaboratorService from 'services/collaborator'
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

const create = async ({ name, owner }) => {
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

    // craete infrastructure

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
    identifier
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
    ...condition
  })

  return projects
}

export default {
  create,
  get,
  list
}
