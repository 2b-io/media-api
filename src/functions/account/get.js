import { OK } from 'http-status-codes'

import endpoint from 'rest/endpoint'

export default endpoint(
  async (req) => {
    const { identifier } = req.pathParameters

    return {
      statusCode: OK,
      resource: {
        identifier
      }
    }
  }
)
