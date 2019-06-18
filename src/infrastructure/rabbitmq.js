import amqp from 'amqplib'
import uuid from 'uuid'
import config from 'infrastructure/config'

const state = {
  connection: null,
  channel: null,
  queue: `${ config.rabbitmq.prefix }${ config.rabbitmq.queue }`,
  deadLetter: {
    exchange: `${ config.rabbitmq.prefix }${ config.rabbitmq.queue }.dead-letter`,
    queue: `${ config.rabbitmq.prefix }${ config.rabbitmq.queue }.dead-letter`
  }
}

const connect = async () => {
  if (state.connection === null) {
    console.log('Connecting to RabbitMQ...')

    state.connection = await amqp.connect(config.rabbitmq.uri)
    state.channel = await state.connection.createConfirmChannel()

    // dead-letter
    await state.channel.assertExchange(state.deadLetter.exchange, 'fanout')
    await state.channel.assertQueue(state.deadLetter.queue, {
      durable: true
    })
    await state.channel.bindQueue(state.deadLetter.queue, state.deadLetter.exchange)

    await state.channel.assertQueue(state.queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': state.deadLetter.exchange
      }
    })

    console.log('RabbitMQ connected!')
  } else {
    console.log('Reuse alive RabbitMQ connection.')
  }

  return state
}

export const send = async (msg, options = {}) => {
  const { connection, channel, queue } = await connect()

  await new Promise((resolve, reject) => {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageId: options.messageId || uuid.v4(),
      appId: options.appId,
      persistent: true
    }, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

export const get = async () => {
  const { connection, channel, queue } = await connect()

  const msg = await channel.get(queue, {
    noAck: false
  })

  if (!msg) {
    return null
  }

  const messageContent = JSON.parse(msg.content.toString())

  await channel.ack(msg)

  return {
    content: messageContent,
    identifier: msg.properties.messageId
  }
}

export const getDeadMessage = async () => {
  const { connection, channel, deadLetter, queue } = await connect()

  const msg = await channel.get(deadLetter.queue, {
    noAck: false
  })

  if (!msg) {
    return null
  }

  const messageContent = JSON.parse(msg.content.toString())

  await channel.ack(msg)

  return {
    content: messageContent,
    identifier: uuid.v4()
  }
}

export const close = async () => {
  console.log('Close RabbitMQ connection...')

  try {
    await state.channel.close()
    await state.connection.close()
  } catch (e) {
  } finally {
    state.channel = null
    state.connection = null

    console.log('Close RabbitMQ connection... done')
  }
}

export default amqp
