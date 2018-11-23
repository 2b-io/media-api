import createPullSettingModel from 'models/pull-setting'
import createProjectModel from 'models/project'

export default {
  async get(projectIdentifier) {
    const Project = await createProjectModel()

    const { _id: projectId } = await Project.findOne({
      identifier: projectIdentifier
    }).lean()

    const PullSetting = await createPullSettingModel()

    return await PullSetting.findOne({
      project: projectId
    }).lean()
  }
}
