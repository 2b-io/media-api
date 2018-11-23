import ms from 'ms'

export default (resetToken) => ({
  accountIdentifier: resetToken.accountIdentifier,
  token: resetToken.token,
  createdAt: resetToken.createdAt,
  expiredAt: new Date(resetToken.createdAt.valueOf() + ms('7d'))
})
