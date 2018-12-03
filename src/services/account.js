import uuid from 'uuid'

import createAccountModel from 'models/account'
import resetTokenService from 'services/reset-token'

const create = async (data) => {
  const Account = await createAccountModel()

  const existedAccount = await getByEmail(data.email)

  if (existedAccount) {
    return null
  }

  const newAccount = await new Account({
    email: data.email,
    password: uuid.v4(),
    isActive: false
  }).save()

  // create reset-password
  const resetToken = await resetTokenService.create({
    email: data.email
  })

  // send email

  return newAccount
}

const get = async (identifier) => {
  const Account = await createAccountModel()

  return await Account.findOne({
    identifier
  })
}

const getByEmail = async (email) => {
  const Account = await createAccountModel()

  return await Account.findOne({
    email
  })
}

const getById = async (id) => {
  const Account = await createAccountModel()

  return await Account.findById(id)
}

const list = async (condition) => {
  const Account = await createAccountModel()

  return await Account.find(condition)
}

const update = async (identifier, data) => {
  const Account = await createAccountModel()

  return await Account.findOneAndUpdate({
    identifier
  }, data, {
    new: true
  })
}

export default {
  create,
  get,
  getByEmail,
  getById,
  list,
  update
}
