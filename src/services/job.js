import config from 'infrastructure/config'
import { close, get, send } from 'infrastructure/rabbitmq'
import createJobModel from 'models/job'
import createJobLogsModel from 'models/job-logs'

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
    jobs.map(async ({ content, identifier }) => {
      await send({
        ...content
      }, {
        messageId: identifier
      })

      await Job.deleteOne({
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

const logs = async (dataLog) => {
  console.log('Create Job logs...')

  const JobLogs = await createJobLogsModel()

  return await new JobLogs({
    ...dataLog
  }).save()

}
export default {
  create,
  recovery,
  snapshot,
  logs
}
