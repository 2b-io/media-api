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
  let jobNumber = 0

  while ((jobNumber < maxJobs) && (job = await get())) {
    console.log('SNAPSHOT', job)

    await new Job({
      ...job
    }).save()

    jobNumber++
  }

  console.log('SNAPSHOT_JOBS_DONE')

  return {
    snapshotJobs: jobNumber
  }
}

const recovery = async ({ maxJobs }) => {
  console.log('RECOVERY_JOBS')

  const Job = await createJobModel()

  const jobs = await Job.find().limit(maxJobs).lean()
  let jobNumber = 0

  await Promise.all(jobs.map(({ content, identifier }, index) => {
    create({ ...content }, { messageId: identifier })

    jobNumber = index + 1

    return Job.deleteOne({
      identifier
    })
  }))

  console.log('RECOVERY_JOBS_DONE')

  return {
    recoveryJobs: jobNumber
  }
}

export default {
  create,
  snapshot,
  recovery
}
