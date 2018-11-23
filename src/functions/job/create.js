import { BAD_REQUEST, CREATED, NOT_IMPLEMENTED } from 'http-status-codes'
import uuid from 'uuid'

import resource from 'rest/resource'
import jobService from 'services/job'

export default resource('JOB')(
  async (req, session) => {
    const { name, when, payload } = JSON.parse(req.body) || {}

    if (!name || !when) {
      return {
        statusCode: BAD_REQUEST
      }
    }

    const identifier = uuid.v4()

    const job = await jobService.create({
      name,
      when,
      payload
    }, {
      appId: session.app,
      messageId: identifier
    })

    return {
      statusCode: CREATED,
      resource: {
        identifier,
        ...job
      }
    }
  }
)
