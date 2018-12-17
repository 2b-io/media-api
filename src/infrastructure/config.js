export default {
  serverBind: process.env.SERVER_BIND,
  serverPort: process.env.SERVER_PORT,
  mongo: {
    uri: process.env.MONGODB_URI,
    ttl: process.env.MONGODB_TTL
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    queue: process.env.RABBITMQ_QUEUE,
    prefix: process.env.RABBITMQ_PREFIX,
    ttl: process.env.RABBITMQ_TTL
  },
  elasticsearch: {
    host: process.env.AWS_ELASTICSEARCH_HOST,
    prefix: process.env.AWS_ELASTICSEARCH_PREFIX
  }
}
