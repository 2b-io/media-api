import { NOT_IMPLEMENTED } from 'http-status-codes'

import endpoint from 'rest/endpoint'

export default endpoint(
  async (req) => {
    return {
      statusCode: NOT_IMPLEMENTED
    }
  }
)
