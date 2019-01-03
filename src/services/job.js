import config from 'infrastructure/config'
import { send, get } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'

const create = async (job, meta) => {
  console.log('SEND_JOB', job, meta)

  await send(job, meta)

  return job
}

const snapshot = async ({ maxJobs }) => {
  const Job = await createJobModel()
  console.log('SNAPSHOT_JOBS')

  let job = {}
  let counterJob = 0

  while ((counterJob < maxJobs) && (job = await get())) {
    console.log('SNAPSHOT', job)

    await new Job({
      ...job
    }).save()

    counterJob++
  }

  console.log('SNAPSHOT_JOBS_DONE')

  return {
    hits: counterJob
  }
}

const recovery = async ({ maxJobs }) => {
  console.log('RECOVERY_JOBS')

  const Job = await createJobModel()

  const jobs = await Job.find().limit(maxJobs).lean()

  await Promise.all(
    jobs.map(({ content, identifier }) => {
      create({ ...content }, { messageId: identifier })

      return Job.deleteOne({
        identifier
      })
    })
  )

  console.log('RECOVERY_JOBS_DONE')

  return {
    hits: jobs.length
  }
}

export default {
  create,
  snapshot,
  recovery
}
