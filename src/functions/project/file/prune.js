import { FORBIDDEN, OK} from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const SCHEMA = joi.object().keys({
  lastSynchronized: joi.string().isoDate().required(),
  maxKeys: joi.number().min(0)
})

export default resource('FILE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    // TODO: Authorization
    const body = JSON.parse(req.body) || {}
    const values = await joi.validate(body, SCHEMA)

    const { deleted } = await projectService.file.prune(
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
      resource: deleted
    }
  }
)
