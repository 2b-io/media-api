import namor from 'namor'

import createCacheSettingModel from 'models/cache-setting'
import createCollaboratorModel from 'models/collaborator'
import createInfrastructureModel from 'models/infrastructure'
import createInvalidationModel from 'models/invalidation'
import createProjectModel from 'models/project'
import createPresetModel from 'models/preset'
import createPullSettingModel from 'models/pull-setting'

import cacheSettingService from 'services/cache-setting'
import collaboratorService from 'services/collaborator'
import jobService from 'services/job'
import invalidationService from 'services/invalidation'
import infrastructureService from 'services/infrastructure'
import pinnedProjectService from 'services/pinned-project'
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

const remove = async (projectIdentifier) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project || project.isActive) {
    return null
  }

  const Preset = await createPresetModel()
  const PullSetting = await createPullSettingModel()
  const Collaborator = await createCollaboratorModel()
  const CacheSetting = await createCacheSettingModel()
  const Infrastructure = await createInfrastructureModel()
  const Invalidation = await createInvalidationModel()

  await invalidationService.create(project.identifier, 'BY_PROJECT')

  return await Promise.all([
    Preset.deleteMany({ project: project._id }),
    PullSetting.deleteMany({ project: project._id }),
    Collaborator.deleteMany({ project: project._id }),
    CacheSetting.deleteMany({ project: project._id }),
    pinnedProjectService.remove(project._id),
    Invalidation.deleteMany({ project: project._id }),
    Infrastructure.deleteMany({ project: project._id }),
    Project.findOneAndRemove({ _id: project._id })
    // TODO: Remove Report metric
  ])
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
