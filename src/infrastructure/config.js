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
  // TODO: hardcode into config. Move to database after confirm idea
  services: [
    {
      app: 'webapp',
      secret: 'kh8i9MnwxUKrDYA37akVsa7ainA8jf7LqeZHYGuSnFsQdgk72dxga6osgNBjC6s24pFAPoSw2Ku8bCrwVyp3dLdiVc'
    }
  ],
  apps: {
    WEBAPP: 'webapp',
    JOB_LOOP: 'job-loop',
  }
}
