export default {
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
  aws: {
    elasticsearch: {
      host: process.env.AWS_ELASTICSEARCH_HOST,
      prefix: process.env.AWS_ELASTICSEARCH_PREFIX
    }
  }
}
