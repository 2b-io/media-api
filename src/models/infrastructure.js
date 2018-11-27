import hash from 'shorthash'

import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  identifier: {
    type: String,
    unique: true,
    index: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  ref: {
    type: String,
    index: true
  },
  provider: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    index: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed
  },
  cname: {
    type: String,
    index: true
  }
}, {
  timestamps: true
})

schema.pre('save', function(next) {
  if (!this.identifier) {
    this.identifier = hash.unique(this._id.toString())
  }

  next()
})

export default () => register('Infrastructure', schema)
