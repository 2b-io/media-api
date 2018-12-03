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

  const collaborator = await Collaborator.findOneAndUpdate({ project: project._id,
    account: account._id
  }, data, {
    upsert: true,
    new: true
  }).lean()

  return {
    ...collaborator,
    accountIdentifier: account.identifier
  }
}

const update = async (projectIdentifier, { emails }) => {
  const project = await projectService.get(projectIdentifier)

  const accounts = await Promise.all(
    emails.map(async (email) => {
      const account = await accountService.getByEmail(email)
      if (!account) {
        return await accountService.create({ email })
      } else {
        return account
      }
    })
  )

  if (!project || !accounts) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  return await Promise.all(
    accounts.map(async (account) => {
      const collaborator = await Collaborator.findOne({
        project: project._id,
        account: account._id,
      }).lean()

      if (collaborator) {
        return {
          ...collaborator,
          accountIdentifier: account.identifier
        }
      }

      const newCollaborator = await Collaborator.findOneAndUpdate({
        project: project._id,
        account: account._id,
      }, {
        privilege: 'admin'
      }, {
        upsert: true,
        new: true
      }).lean()

      return {
        ...newCollaborator,
        accountIdentifier: account.identifier
      }
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

  return await Collaborator.findOneAndRemove({
    project: project._id,
    account: account._id
  })
}


const listByProjectIdentifier = async (projectIdentifier) => {
  const project = await projectService.get(projectIdentifier)

  if (!project) {
    return null
  }

  const Collaborator = await createCollaboratorModel()

  const collaborators = await Collaborator.find({
    project: project._id
  }).lean()

  return await Promise.all(
    collaborators.map(
      async (collaborator) => {
        const account = await accountService.getById(collaborator.account)

        return {
          ...collaborator,
          accountIdentifier: account.identifier
        }
      }
    )
  )
}

const listByAccountId = async (accountId) => {
  const Collaborator = await createCollaboratorModel()

  const collaborators = await Collaborator.find({
    account: accountId
  }).lean()

  return await Promise.all(
    collaborators.map(
      async (collaborator) => {
        const account = await accountService.getById(collaborator.account)

        return {
          ...collaborator,
          accountIdentifier: account.identifier
        }
      }
    )
  )
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
