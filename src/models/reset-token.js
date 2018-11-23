import hash from 'shorthash'
import uuid from 'uuid'

import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  accountIdentifier: {
    type: String,
    required: true
  },
  token: {
    type: String,
    index: true,
    unique: true
  }
}, {
  collection: 'resetTokens',
  timestamps: true
})

schema.index({
  createdAt: 1
}, {
  expires: '7d'
})

schema.pre('save', function(next) {
  if (!this.token) {
    this.token = hash.unique(uuid.v4())
  }

  next()
})

export default () => register('ResetToken', schema)
