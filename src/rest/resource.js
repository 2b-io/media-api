import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED
} from 'http-status-codes'
import isArray from 'isarray'
import serializeError from 'serialize-error'

import accountService from 'services/account'
import * as transformers from 'transformers'

const normalizeHttpHeaders = (headers) => Object.entries(headers).reduce(
  (headers, [ name, value ]) => ({
    ...headers,
    [ name.toLocaleLowerCase() ]: value
  }),
  {}
)

const parseAuthorizationHeader = (value) => {
  const [ type, params ] = value.split(' ')

  return {
    type,
    ...(
      params.split(',').reduce(
        (map, pair) => {
          const [ name, value ] = pair.split('=')

          return {
            ...map,
            [ name ]: value
          }
        }, {}
      )
    )
  }
}

const authorize = async (req) => {
  const { authorization } = normalizeHttpHeaders(req.headers)

  if (!authorization) {
    throw {
      statusCode: UNAUTHORIZED
    }
  }

  const {
    type,
    app,
    account: accountIdentifier
  } = parseAuthorizationHeader(authorization)

  if (type !== 'MEDIA_CDN') {
    throw {
      statusCode: UNAUTHORIZED
    }
  }

  // TODO: verify app

  const account = accountIdentifier ?
    await accountService.get(accountIdentifier) :
    null

  if (accountIdentifier && !account) {
    throw UNAUTHORIZED
  }

  return {
    app,
    account
  }
}

const transform = (type, resource) => {
  const transformer = transformers[ type ] || ((r) => r)

  return isArray(resource) ?
    resource.map(transformer) :
    transformer(resource)
}

export default (resourceType) => (logic) => {
  const handler = async (req, context) => {
    // Make sure to add this so you can re-use `connnection` between function calls.
    // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      const session = await authorize(req)

      const {
        resource,
        statusCode
      } = await logic(req, session)

      return {
        statusCode,
        body: resource ?
          JSON.stringify(transform(resourceType, resource)) :
          null
      }
    } catch (error) {
      // validation error
      if (error.isJoi) {
        return {
          statusCode: BAD_REQUEST,
          body: JSON.stringify({
            reason: error.details
          })
        }
      }

      return {
        statusCode: error.statusCode || INTERNAL_SERVER_ERROR,
        body: JSON.stringify({
          reason: serializeError(error.reason || error)
        })
      }
    }
  }

  handler.logic = logic

  return handler
}
