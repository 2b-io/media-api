import mongoose, { register } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  ttl: {
    type: Number
  }
}, {
  collection: 'cacheSettings',
  timestamps: true
})

export default () => register('CacheSetting', schema)
