import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import pinnedProjectService from 'services/pinned-project'

const SCHEMA = joi.object().keys({
  projectIdentifiers: joi.array().items(
    joi.string().trim().required()
  ).required()
})

export default resource('PINNED_PROJECT')(
  async (req) => {
    const { accountIdentifier } = req.pathParameters
    const body = JSON.parse(req.body) || {}
    // TODO: Authorization
    const values = await joi.validate(body, SCHEMA)

    const pinnedProjects = await pinnedProjectService.update(
      accountIdentifier,
      values
    )

    if (!pinnedProjects) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: pinnedProjects
    }
  }
)
