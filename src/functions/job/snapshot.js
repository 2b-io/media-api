import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import jobService from 'services/job'

export default resource('JOB')(
  async (req) => {
    jobService.snapshot()

    return {
      statusCode: OK
    }
  }
)
