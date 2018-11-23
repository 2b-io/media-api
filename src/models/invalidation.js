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
  patterns: [ String ],
  status: {
    type: String
  },
}, {
  timestamps: true
})

schema.pre('save', function(next) {
  if (!this.identifier) {
    this.identifier = hash.unique(this._id.toString())
  }

  next()
})


export default () => register('Invalidation', schema)
