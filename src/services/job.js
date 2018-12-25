import config from 'infrastructure/config'
import { send } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'
import { createConsumer } from 'services/work-queue/consumer'

const create = async (job, meta) => {
  console.log('SEND JOB', job, meta)

  await send(job, meta)

  return job
}

const snapshot = async () => {
  const Job = await createJobModel()

  console.log('SNAPSHOT_JOBS')

  const consumer = createConsumer({
    host: config.rabbitmq.uri,
    queue: config.rabbitmq.queue,
    prefix: config.rabbitmq.prefix,
    shortBreak: config.pulling.shortBreak,
    longBreak: config.pulling.longBreak
  })

  await consumer.connect()

  await consumer.onReceive(async (jobData) => {
    const job = await new Job({
      ...jobData
    }).save()
  })

  return true
}

const recovery = async () => {
  const Job = await createJobModel()

  const jobs = await Job.find().lean()

  await Promise.all(
    jobs.map(async (job) => {
       await create(job)
     })
   )

  await Job.remove()
  
  return true
}

export default {
  create,
  snapshot,
  recovery
}
