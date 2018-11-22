import createResetTokenModel from 'models/reset-token'
import accountService from 'services/account'

const create = async (data) => {
  const account = await accountService.getByEmail(data.email)

  if (!account) {
    return null
  }

  const ResetToken = await createResetTokenModel()

  return await new ResetToken({
    email: data.email
  }).save()
}

export default {
  create
}
