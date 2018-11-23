import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  provider: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
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

export default () => register('Infrastructure', schema)
