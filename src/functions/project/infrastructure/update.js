import { NOT_FOUND, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import infrastructureService from 'services/infrastructure'

const SCHEMA = joi.object().keys({
  ref: joi.string().trim().required(),
  cname: joi.string().hostname().required(),
  domain: joi.string().hostname().required()
})

export default resource('INFRASTRUCTURE')(
  async (req) => {
    const { projectIdentifier } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const infrastructure = await infrastructureService.update(projectIdentifier, values)

    if (!infrastructure) {
      throw {
        statusCode: NOT_FOUND
      }
    }

    return {
      statusCode: OK,
      resource: infrastructure
    }
  }
)
