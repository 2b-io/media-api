import createPullSettingModel from 'models/pull-setting'
import projectService from 'services/project'

const create = async (data) => {
  const PullSetting = await createPullSettingModel()

  return await new PullSetting({
    project: data.projectId
  }).save()
}

const get = async (projectIdentifier) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const PullSetting = await createPullSettingModel()

  return await PullSetting.findOne({
    project: project._id
  })
}

export default {
  create,
  get
}
