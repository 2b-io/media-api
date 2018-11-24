export default (invalidation) => ({
  identifier: invalidation.identifier,
  patterns: invalidation.patterns,
  status: invalidation.status,
  createdAt: invalidation.createdAt
})
