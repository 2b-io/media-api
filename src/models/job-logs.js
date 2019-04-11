import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  time: {
    type: Date,
    index: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  lastState: {
    type: String,
    required: true
  },
  lastTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  collection: 'jobLogs'
})

export default () => register('JobLogs', schema)
