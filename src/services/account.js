import createAccountModel from 'models/account'

export default {
  async list(condition) {
    const Account = await createAccountModel()

    return await Account.find(condition).lean()
  },
  async get(identifier) {
    const Account = await createAccountModel()

    return await Account.findOne({
      identifier
    }).lean()
  }
}
