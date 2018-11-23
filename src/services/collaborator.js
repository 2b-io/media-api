import createCollaboratorModel from 'models/collaborator'

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

const listByAccountId = async (accountId) => {
  const Collaborator = await createCollaboratorModel()

  return await Collaborator.find({
    account: accountId
  })
}

export default {
  create,
  get,
  listByAccountId
}
