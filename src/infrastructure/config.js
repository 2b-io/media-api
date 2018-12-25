export default {
  webappUrl: process.env.WEBAPP_URL,
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
    host: process.env.ELASTICSEARCH_HOST,
    fileVersion: process.env.ELASTICSEARCH_FILE_VERSION,
    datapointVersion: process.env.ELASTICSEARCH_DATAPOINT_VERSION
  },
  pulling: {
    shortBreak: process.env.PULLING_SHORT_BREAK,
    longBreak: process.env.PULLING_LONG_BREAK
  }
}
