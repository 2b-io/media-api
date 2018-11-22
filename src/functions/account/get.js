import { OK } from 'http-status-codes'

import endpoint from 'rest/endpoint'

export default endpoint(
  async (event) => {
    const { identifier } = event.pathParameters

    return {
      statusCode: OK,
      resource: {
        identifier
      }
    }
  }
)
