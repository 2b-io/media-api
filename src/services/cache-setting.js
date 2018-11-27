import ms from 'ms'

import createCacheSettingModel from 'models/cache-setting'
import projectService from 'services/project'

const DEFAULT_CACHE_SETTING = {
  ttl: ms('90d') / 1000
}

const create = async (data) => {
  const CacheSetting = await createCacheSettingModel()

  return await new CacheSetting({
    project: data.projectId,
    ...DEFAULT_CACHE_SETTING
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
