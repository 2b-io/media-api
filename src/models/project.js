import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String
  },
  status: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default () => register('Project', schema)
