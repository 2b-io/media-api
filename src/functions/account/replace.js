import { NOT_IMPLEMENTED } from 'http-status-codes'

import resource from 'rest/resource'

export default resource(
  async (req) => {
    return {
      statusCode: NOT_IMPLEMENTED
    }
  }
)
