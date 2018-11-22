import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
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
  }
}, {
  timestamps: true
})

export default async () => register('Project', schema)
