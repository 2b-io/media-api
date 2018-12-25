import { CREATED, FORBIDDEN } from 'http-status-codes'

import resource from 'rest/resource'
import jobService from 'services/job'

export default resource('JOB')(
  async (req) => {

    const jobs = await jobService.snapshot()

    if (!jobs) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED
    }
  }
)
