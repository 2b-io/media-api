import keygen from 'keygen'

import createSecretKeyModel from 'models/secret-key'

const create = async (data) => {
  const SecretKey = await createSecretKeyModel()

  const newSecretKey = await new SecretKey({
    key: keygen.url(100),
    app: data.app,
    title: data.title,
    description: data.description
  }).save()

  return newSecretKey
}

const get = async (key) => {
  const SecretKey = await createSecretKeyModel()

  return await SecretKey.findOne({
    key
  })
}

const list = async (condition) => {
  const SecretKey = await createSecretKeyModel()

  return await SecretKey.find(condition)
}

const update = async (key, data) => {
  const SecretKey = await createSecretKeyModel()

  return await SecretKey.findOneAndUpdate({
    key
  }, data, {
    new: true
  })
}

const remove = async (key) => {
  const SecretKey = await createSecretKeyModel()

  const secretKey = await SecretKey.findOne({
    key
  })

  if (!secretKey) {
    return null
  }

  return await SecretKey.findOneAndUpdate({
    _id: secretKey._id
  }, {
    isDeleted: true
  }, {
    new: true
  })
}


export default {
  create,
  get,
  list,
  update,
  remove
}
