import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true
  },
  app: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'secretKeys',
  timestamps: true
})

export default () => register('SecretKeys', schema)
