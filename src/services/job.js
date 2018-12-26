import config from 'infrastructure/config'
import { send, get } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'

const create = async (job, meta) => {
  console.log('SEND JOB', job, meta)

  await send(job, meta)

  return job
}

const snapshot = async () => {
  const Job = await createJobModel()
  console.log('SNAPSHOT_JOBS')

  let job = {}

  while (job = await get()) {
    await new Job({
      ...job
    }).save()
  }

  return true
}

const recovery = async () => {
  const Job = await createJobModel()

  const jobs = await Job.find().lean()

  await Promise.all(jobs.map(({ message, identifier }) => {
    create({ ...message }, { messageId: identifier })
  }))

  await Job.remove()

  return true
}

export default {
  create,
  snapshot,
  recovery
}
