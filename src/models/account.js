import mongoose, { connect } from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  identifier: {
    type: String,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Anonymous',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false,
    index: true
  }
})

schema.index({ email: 'text' })

export default async () => {
  const connection = await connect()

  return connection.model('Account', schema)
}
