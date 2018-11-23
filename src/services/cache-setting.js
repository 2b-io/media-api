import createCacheSettingModel from 'models/cache-setting'
import projectService from 'services/project'

const create = async (data) => {
  const CacheSetting = await createCacheSettingModel()

  return await new CacheSetting({
    project: data.projectId
  }).save()
}

const get = async (projectIdentifier) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const CacheSetting = await createCacheSettingModel()

  return await CacheSetting.findOne({
    project: project._id
  })
}

export default {
  create,
  get
}
