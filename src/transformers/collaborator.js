export default (collaborator) => ({
  accountIdentifier: collaborator.account,
  privilege: collaborator.privilege,
  createdAt: collaborator.createdAt
})
