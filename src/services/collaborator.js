import createCollaboratorModel from 'models/collaborator'
import accountService from 'services/account'
import projectService from 'services/project'

const create = async (data) => {
  const Collaborator = await createCollaboratorModel()

  return await new Collaborator({
    project: data.projectId,
    account: data.accountId,
    privilege: data.privilege
  }).save()
}

const get = async (projectId, accountId) => {
  const Collaborator = await createCollaboratorModel()

  return await Collaborator.findOne({
    account: accountId,
    project: projectId
  })
}

const replace = async (projectIdentifier, accountIdentifier, data) => {
  const account = await accountService.get(accountIdentifier)

  const project = await projectService.get(projectIdentifier)

  if (!account || !project) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  return await Collaborator.findOneAndUpdate(
    { project: project._id },
    { account: account._id, ...data },
    { upsert: true, new: true }
  )
}

const update = async (projectIdentifier, { emails }) => {

  const project = await projectService.get(projectIdentifier)

  const accounts = await Promise.all(
    emails.map(async (email) => {
      return await accountService.getByEmail(email)
    })
  )

  if (!project || !accounts) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  return await await Promise.all(
    accounts.map(async (account) => {
      return await Collaborator.findOneAndUpdate(
        { project: project._id },
        { account: account._id },
        { upsert: true, new: true }
      )
    })
  )
}

const remove = async (projectIdentifier, accountIdentifier) => {
  const account = await accountService.get(accountIdentifier)

  const project = await projectService.get(projectIdentifier)

  if (!account || !project) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  return await Collaborator.findOneAndRemove(
    { project: project._id },
    { account: account._id
  )
}


const listByProjectIdentifier = async (projectIdentifier) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  return await Collaborator.find({
    project: project._id
  })
}

const listByAccountId = async (accountId) => {
  const Collaborator = await createCollaboratorModel()

  return await Collaborator.find({
    account: accountId
  })
}

export default {
  create,
  get,
  listByAccountId,
  listByProjectIdentifier,
  replace,
  remove,
  update
}
