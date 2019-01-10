import config from 'infrastructure/config'
import { close, get, send } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'

const create = async (job, meta) => {
  console.log('Send Job...')

  await send(job, meta)

  await close()

  return job
}

const snapshot = async ({ maxJobs }) => {
  const Job = await createJobModel()

  console.log('Create Job Snapshot...')

  let job = {}
  let counterJob = 0

  while ((counterJob < maxJobs) && (job = await get())) {
    await new Job({
      ...job
    }).save()

    counterJob++
  }

  await close()

  console.log('Create Job Snapshot... done')

  return {
    hits: counterJob
  }
}

const recovery = async ({ maxJobs }) => {
  console.log('Create Job Recovery...')

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

  await close()

  console.log('Create Job Recovery... done')

  return {
    hits: jobs.length
  }
}

export default {
  create,
  recovery,
  snapshot
}
