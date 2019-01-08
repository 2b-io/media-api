import { FORBIDDEN, OK} from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'
import authorize from 'middlewares/authorize'
import config from 'infrastructure/config'

const SCHEMA = joi.object().keys({
  lastSynchronized: joi.string().isoDate().required(),
  maxKeys: joi.number().min(0)
})

export default authorize([
  config.apps.WEBAPP,
  config.apps.JOB_LOOP,
  config.apps.CDN,
  config.apps.S3_SYNC,
  config.apps.ADMINAPP,
])(resource('DELETE_FILES')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: Authorization
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const result = await projectService.file.prune(
      projectIdentifier,
      values
    )

    if (!result) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: result
    }
  }
))
