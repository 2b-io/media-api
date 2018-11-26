import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const schema = joi.object().keys({
  name: joi.string().max(50).trim().required(),
  provider: joi.any().valid('cloudfront').required()
})

export default resource('PROJECT')(
  async (req, session) => {
    const body = JSON.parse(req.body) || {}

    // validation
    const values = await joi.validate(body, schema)

    if (!session.account) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: CREATED,
      resource: values
    }

    const project = await projectService.create({
      name,
      provider,
      owner: session.account._id
    })

    return {
      statusCode: CREATED,
      resource: project
    }
  }
)
