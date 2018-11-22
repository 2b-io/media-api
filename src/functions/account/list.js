import { OK } from 'http-status-codes'

import endpoint from 'rest/endpoint'

export default endpoint(
  async (req) => {
    return {
      statusCode: OK,
      resource: []
    }
  }
)
