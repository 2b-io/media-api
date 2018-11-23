import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status-codes'

import resource from 'rest/resource'
import projectService from 'services/project'

export default resource('PROJECT')(
  async (req, session) => {
    const { name, provider } = JSON.parse(req.body) || {}

    if (!name || provider !== 'cloudfront')  {
      return {
        statusCode: BAD_REQUEST
      }
    }

    if (!session.account) {
      return {
        statusCode: FORBIDDEN
      }
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
