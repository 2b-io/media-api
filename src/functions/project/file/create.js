import { NOT_IMPLEMENTED } from 'http-status-codes'

import resource from 'rest/resource'

export default resource('FILE')(
  async (req) => {
    throw {
      statusCode: NOT_IMPLEMENTED
    }
  }
)
