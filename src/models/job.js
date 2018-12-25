import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  messageId: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed
  },
  when: {
    type: Date
  }
}, {
  timestamps: true
})

export default () => register('Job', schema)
