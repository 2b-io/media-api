// Using Mongoose With AWS Lambda: https://mongoosejs.com/docs/
import mongoose from 'mongoose'
import config from 'infrastructure/config'

let connection = null
let connectionExpiration = null

export const connect = async () => {
  // Because `connection` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (connection === null || connection.readyState !== 1) {
    console.log('Connecting to MongoDB...')

    connection = await mongoose.createConnection(config.mongoUri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    })

    console.log('MongoDB connected!')
  } else {
    console.log('Reuse alive MongoDB connection.')
  }

  // reset expiration
  clearTimeout(connectionExpiration)

  connectionExpiration = setTimeout(() => {
    console.log('Connection expired!')
    connection.close()
  }, 30e3)

  return connection
}

// don't use `mpromise`
mongoose.Promise = Promise
export default mongoose
