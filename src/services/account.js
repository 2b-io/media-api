import uuid from 'uuid'

import createAccountModel from 'models/account'

const create = async (data) => {
  const Account = await createAccountModel()

  const existedAccount = await getByEmail(data.email)

  if (existedAccount) {
    return null
  }

  const newAccount = await new Account({
    email: data.email,
    password: uuid.v4()
  }).save()

  // send email

  return newAccount
}

const get = async (identifier) => {
  const Account = await createAccountModel()

  return await Account.findOne({
    identifier
  }).lean()
}

const getByEmail = async (email) => {
  const Account = await createAccountModel()

  return await Account.findOne({
    email
  }).lean()
}

const list = async (condition) => {
  const Account = await createAccountModel()

  return await Account.find(condition).lean()
}

export default {
  create,
  get,
  getByEmail,
  list
}
