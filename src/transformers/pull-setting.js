export default (pullSetting) => ({
  pullUrl: pullSetting.pullUrl,
  allowedOrigins: pullSetting.allowedOrigins,
  headers: pullSetting.headers.map(
    (header) => ({
      name: header.name,
      value: header.value
    })
  )
})
