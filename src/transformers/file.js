export default (file) => ({
  key: file.key,
  contentType: file.contentType,
  contentLength: file.contentLength,
  expires: file.expires,
  isOrigin: file.isOrigin,
  lastModified: file.lastModified,
  lastSynchronized: file.lastSynchronized,
  originUrl: file.originUrl,
  preset: file.preset
})
