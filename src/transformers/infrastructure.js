export default (infrastructure) => ({
  identifier: infrastructure.identifier,
  ref: infrastructure.ref,
  cname: infrastructure.cname,
  domain: infrastructure.domain,
  provider: infrastructure.provider,
  settings: infrastructure.settings
})
