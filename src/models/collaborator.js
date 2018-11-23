import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  privilege: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default () => register('Collaborator', schema)

