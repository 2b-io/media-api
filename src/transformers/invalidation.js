export default (invalidation) => ({
  identifier: invalidation.identifier,
  project: invalidation.project,
  patterns: invalidation.patterns,
  cdnInvalidationRef: invalidation.cdnInvalidationRef,
  status: invalidation.status,
  createdAt: invalidation.createdAt
})
