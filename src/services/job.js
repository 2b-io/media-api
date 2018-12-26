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

  do {
    job = await get()

    if (!job) {
      return true
    }

    await new Job({
      ...job
    }).save()

  } while (job)

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
