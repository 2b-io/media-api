import { NOT_FOUND, OK } from 'http-status-codes'

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
    const { accountIdentifier } = req.pathParameters

    const account = await accountService.get(accountIdentifier)

    if (!account) {
      return {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: account
    }
  }
))
