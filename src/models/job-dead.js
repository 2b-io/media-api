import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  identifier: {
    type: String,
    index: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
})

export default () => register('JobDead', schema)
