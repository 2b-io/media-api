import config from 'infrastructure/config'
import { send, get } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'

const create = async (job, meta) => {
  console.log('SEND_JOB', job, meta)

  await send(job, meta)

  return job
}

const snapshot = async () => {
  const Job = await createJobModel()
  console.log('START_SNAPSHOT_JOBS')

  let job

  while (job = await get()) {
    console.log('PROGRESS_SNAPSHOT', job)

    await new Job({
      ...job
    }).save()
  }

  console.log('SNAPSHOT_JOBS_SUCCESS')
}

const recovery = async () => {
  console.log('START_RECOVERY_JOBS')

  const Job = await createJobModel()

  const jobs = await Job.find().lean()

  await Promise.all(jobs.map(({ content, identifier }) => {
    console.log('PROGRESS_RECOVERY_JOB')

    create({ ...content }, { messageId: identifier })

    return Job.deleteOne({
      identifier
    })
  }))

  console.log('RECOVERY_JOBS_SUCCESS')
}

export default {
  create,
  snapshot,
  recovery
}
