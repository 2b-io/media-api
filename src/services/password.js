import accountService from 'services/account'
import resetTokenService from 'services/reset-token'

const replaceByCurrentPassword = async (identifier, currentPassword, newPassword) => {
  const account = await accountService.get(identifier)

  if (!account) {
    return null
  }

  const correctPassword = account.comparePassword(currentPassword)

  if (!correctPassword) {
    return null
  }

  account.password = newPassword
  account.isActive = true

  await account.save()

  return true
}

const replaceByToken = async (identifier, token, newPassword) => {
  const resetToken = await resetTokenService.get(token)

  if (!resetToken) {
    return null
  }

  const account = await accountService.getByEmail(resetToken.email)

  if (!account || account.identifier !== identifier) {
    return null
  }

  account.password = newPassword
  account.isActive = true

  await account.save()

  await resetToken.remove()

  return true
}

export default {
  replaceByCurrentPassword,
  replaceByToken
}
