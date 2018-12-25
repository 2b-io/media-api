import { OK, FORBIDDEN } from 'http-status-codes'

import resource from 'rest/resource'
import jobService from 'services/job'

export default resource('JOB')(
  async (req) => {

    const jobs = await jobService.recovery()

    if (!jobs) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK
    }
  }
)
