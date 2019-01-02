import { OK } from 'http-status-codes'

import resource from 'rest/resource'
import accountService from 'services/account'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('ACCOUNT')(
  async (req) => {
    const params = req.queryStringParameters || {}
    const accounts = await accountService.list(params)

    if (!accounts) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: accounts
    }
  }
))
