export default (invalidation) => ({
  identifier: invalidation.identifier,
  patterns: invalidation.patterns,
  cdnInvalidationRef: invalidation.cdnInvalidationRef,
  status: invalidation.status,
  createdAt: invalidation.createdAt
})
