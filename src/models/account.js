import bcrypt from 'bcrypt'
import hash from 'shorthash'
import mongoose, { register } from 'infrastructure/mongoose'

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
}, {
  timestamps: true
})

schema.index({ email: 'text' })

schema.pre('save', function(next) {
  if (!this.identifier) {
    this.identifier = hash.unique(this._id.toString())
  }

  next()
})

schema.virtual('password').set(function(password) {
  this.hashedPassword = hashPassword(password)
})

schema.methods = {
  comparePassword(plain) {
    return bcrypt.compareSync(plain, this.hashedPassword)
  },
}

export const hashPassword = (plain) => {
  return bcrypt.hashSync(plain, 12)
}

export default () => register('Account', schema)
