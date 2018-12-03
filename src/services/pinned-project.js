import createPinnedProjectModel from 'models/pinned-project'
import accountService from 'services/account'

const list = async (accountIdentifier) => {
  const account = await accountService.get(accountIdentifier)

  if (!account) {
    return null
  }

  const PinnedProject = await createPinnedProjectModel()

  return await PinnedProject.findOne({
    account: account._id
  })
}

const update = async (accountIdentifier, data) => {
  const account = await accountService.get(accountIdentifier)

  if (!account) {
    return null
  }

  const PinnedProject = await createPinnedProjectModel()

  return await PinnedProject.findOneAndUpdate({
    account: account._id
  }, data, {
    new: true
  })
}

const remove = async (projectId) => {
  const PinnedProject = await createPinnedProjectModel()

  return await PinnedProject.findOneAndRemove({
    project: projectId
  })
}

export default {
  list,
  remove,
  update
}
