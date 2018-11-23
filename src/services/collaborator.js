import createCollaboratorModel from 'models/collaborator'

const create = async (data) => {
  const Collaborator = await createCollaboratorModel()

  return await new Collaborator({
    project: data.projectId,
    account: data.accountId,
    privilege: data.privilege
  }).save()
}

export default {
  create
}
