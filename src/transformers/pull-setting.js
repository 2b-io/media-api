export default (pullSetting) => ({
  allowedOrigins: pullSetting.allowedOrigins,
  headers: pullSetting.headers.map(
    (header) => ({
      name: header.name,
      value: header.value
    })
  )
})
