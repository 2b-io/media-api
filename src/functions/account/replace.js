import { NOT_IMPLEMENTED } from 'http-status-codes'

import resource from 'rest/resource'

export default resource('ACCOUNT')(
  async (req) => {
    return {
      statusCode: NOT_IMPLEMENTED
    }
  }
)
