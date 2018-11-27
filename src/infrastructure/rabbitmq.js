import amqp from 'amqplib'
import ms from 'ms'
import uuid from 'uuid'
import config from 'infrastructure/config'

const state = {
  connection: null,
  channel: null,
  queue: `${ config.rabbitmq.prefix }${ config.rabbitmq.queue }`
}
const ttl = ms(config.rabbitmq.ttl || '30s')
let connectionExpiration = null

const connect = async () => {
  if (state.connection === null) {
    console.log('Connecting to RabbitMQ...')

    state.connection = await amqp.connect(config.rabbitmq.uri)
    state.channel = await state.connection.createChannel()
    await state.channel.checkQueue(state.queue)

    console.log('RabbitMQ connected!')
  } else {
    console.log('Reuse alive RabbitMQ connection.')
  }

  // reset expiration
  clearTimeout(connectionExpiration)

  connectionExpiration = setTimeout(() => {
    console.log('RabbitMQ Connection expired!')

    // close connection
    state.connection.close()

    // clear state
    state.connection = null
    state.channel = null
  }, ttl)

  return state
}

export const send = async (msg, options = {}) => {
  const { connection, channel, queue } = await connect()

  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    messageId: options.messageId || uuid.v4(),
    appId: options.appId,
    persistent: true
  })
}

export default amqp
