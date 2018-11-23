import invalidationModel from 'models/invalidation'
import projectService from 'services/project'

export default {
  async create(projectIdentifier, patterns) {
    const project = await projectService.get(projectIdentifier)

    if (!project) {
      return null
    }

    const Invalidation = await invalidationModel()

    return await new Invalidation({
      project: project._id,
      patterns,
      status:'INPROGRESS'
    }).save()
  }
}
