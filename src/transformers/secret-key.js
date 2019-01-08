export default (secretKey) => ({
  key: secretKey.key,
  title: secretKey.title,
  app: secretKey.app,
  description: secretKey.description,
  isDeleted: secretKey.isDeleted
})
