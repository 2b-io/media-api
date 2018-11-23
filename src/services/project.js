import namor from 'namor'

import createProjectModel from 'models/project'
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
    await pullSettingService.create({
      projectId: project._id
    })

    return project
  } catch (e) {
    // rollback
    await project.remove()

    throw e
  }
}

const get = async (identifier) => {
  const Project = await createProjectModel()

  return await Project.findOne({
    identifier
  })
}

const list = async (condition) => {
  const Project = await createProjectModel()

  return await Project.find(condition)
}

export default {
  create,
  get,
  list
}
