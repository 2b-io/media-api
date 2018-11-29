import createPinnedProjectModel from 'models/pinned-project'
import accountService from 'services/account'

const list = async (accountIdentifier) => {
  const account = await accountService.get(accountIdentifier)

  if (!account) {
    return null
  }

  const PinnedProject = await createPinnedProjectModel()

  return await PinnedProject.find({
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
export default {
  list,
  update
}
