import createProjectModel from 'models/project'

export default {
  async list(condition) {
    const Project = await createProjectModel()

    return await Project.find(condition).lean()
  },
  async get(identifier) {
    const Project = await createProjectModel()

    return await Project.findOne({
      identifier
    }).lean()
  }
}
