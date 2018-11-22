import { INTERNAL_SERVER_ERROR } from 'http-status-codes'
import serializeError from 'serialize-error'

export default (handler) => async (event) => {
  try {
    // TODO: check 'authorization' header here

    const { statusCode, resource } = await handler(event)

    return {
      statusCode,
      body: resource ?
        JSON.stringify(resource) :
        null
    }
  } catch (e) {
    return {
      statusCode: INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        reason: serializeError(e)
      })
    }
  }
}
