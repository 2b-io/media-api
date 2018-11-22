export default (account) => ({
  identifier: account.identifier,
  email: account.email,
  name: account.name,
  isActive: account.isActive,
  createdAt: account.createdAt
})
