import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import jobService from 'services/job'

export default resource('JOB')(
  (req) => {
    jobService.recovery()

    return {
      statusCode: OK
    }
  }
)
