import createProjectModel from 'models/project'

export default {
  async list(condition) {
    const Project = await createProjectModel()

    return await Project.find(condition)
  },
  async get(identifier) {
    const Project = await createProjectModel()

    return await Project.findOne({
      identifier
    })
  }
}
