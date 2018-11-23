import uuid from 'uuid'

import createInvalidationModel from 'models/invalidation'
import jobService from 'services/job'
import projectService from 'services/project'

export default {
  async create(projectIdentifier, { patterns, options }) {
    const project = await projectService.get(projectIdentifier)

    if (!project) {
      return null
    }

    const Invalidation = await createInvalidationModel()

    const newInvadidation = await new Invalidation({
      project: project._id,
      patterns,
      status:'INPROGRESS'
    }).save()

    if (newInvadidation) {
      const identifier = uuid.v4()

      await jobService.create({
        name: 'INVALIDATE_CACHE',
        when: Date.now(),
        payload: {
          projectIdentifier,
          patterns,
          options
        }
      }, {
        messageId: identifier
      })
    }

    return newInvadidation
  },
  async get(projectIdentifier, invalidationIdentifier) {
    const Invalidation = await createInvalidationModel()

    const project = await projectService.get(projectIdentifier)

    return await Invalidation.findOne({
      identifier: invalidationIdentifier,
      project: project._id
    }).lean()
  },
  async update(projectIdentifier, invalidationIdentifier, data) {
    const Invalidation = await createInvalidationModel()

    const project = await projectService.get(projectIdentifier)

    return await Invalidation.findOneAndUpdate({
      identifier: invalidationIdentifier,
      project: project._id
    }, data, {
      new: true
    })
  }
}
