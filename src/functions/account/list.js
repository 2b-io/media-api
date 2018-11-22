import { OK } from 'http-status-codes'

import endpoint from 'rest/endpoint'

export default endpoint(
  async (event) => {
    return {
      statusCode: OK,
      resource: []
    }
  }
)
