import createPullSettingModel from 'models/pull-setting'
import projectService from 'services/project'

export default {
  async get(projectIdentifier) {
    const project = await projectService.get(projectIdentifier)

    if (!project) {
      return null
    }

    const PullSetting = await createPullSettingModel()

    return await PullSetting.findOne({
      project: project._id
    }).lean()
  }
}
