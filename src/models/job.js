import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  identifier: {
    type: String,
    index: true
  },
  message: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
})

export default () => register('Job', schema)
