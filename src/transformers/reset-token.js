import ms from 'ms'

export default (resetToken) => ({
  email: resetToken.email,
  token: resetToken.token,
  createdAt: resetToken.createdAt,
  expiredAt: new Date(resetToken.createdAt.valueOf() + ms('7d'))
})
