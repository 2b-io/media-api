export default (collaborator) => ({
  identifier: collaborator.account,
  privilege: collaborator.privilege,
  createdAt: collaborator.createdAt
})
