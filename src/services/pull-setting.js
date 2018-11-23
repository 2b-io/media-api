import createPullSettingModel from 'models/pull-setting'
import projectServices from 'services/project'

export default {
  async get(projectIdentifier) {

    const project = await projectServices.get(projectIdentifier)

    if (!project._id) {
      return null
    }

    const PullSetting = await createPullSettingModel()

    return await PullSetting.findOne({
      project: project._id
    }).lean()
  }
}
