import mongoose, { connect } from 'infrastructure/mongoose'

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
  createdAt: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

schema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = Date.now()
  }

  next()
})

export default async () => {
  const connection = await connect()

  return connection.model('Project', schema)
}
