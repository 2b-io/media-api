
import { send } from 'infrastructure/rabbitmq'

const create = async (job, meta) => {
  await send(job, meta)

  return job
}

export default {
  create
}
