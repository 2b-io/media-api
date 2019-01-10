export default (project) => ({
  identifier: project.identifier,
  name: project.name,
  status: project.status,
  isActive: project.isActive,
  isDeleted: project.isDeleted,
  createdAt: project.createdAt,
  domain: project.domain,
  protocol: project.protocol
})
