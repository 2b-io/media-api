import elasticsearch from 'elasticsearch'

import config from 'infrastructure/config'
import mapping from 'mapping/file'

const PREFIX = config.elasticsearch.prefix
const TYPE_NAME = `${ PREFIX }-media`

const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: 'trace'
})

const createMapping = async (index) => {
  const indexExists = await client.indices.exists({
    index: `${ PREFIX }-${ index }`
  })

  if (indexExists) {
    return
  }

  await client.indices.create({
    index: `${ PREFIX }-${ index }`
  })

  return await client.indices.putMapping({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    body: {
      properties: mapping
    }
  })
}

const create = async (index, id, params) => {
  await createMapping(index)

  return await client.create({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id,
    body: params
  })
}

const replace = async (index, id, params) => {
  return await client.update({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id,
    body: {
      doc: params
    }
  })
}

const get = async (index, id) => {
  const object = await client.get({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id
  })

  return object._source
}

const remove = async (index, id) => {
  return await client.delete({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id
  })
}

const searchWithParams = async (index, params, { from, size }) => {
  return await client.search({
    from,
    size,
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    body: {
      query: {
        ...params
      }
    }
  })
}

const searchWithoutParams = async (index, { from, size }) => {
  return await client.search({
    from,
    size,
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME
  })
}

const checkExistsIndex = async (index) => {
  return await client.indices.exists({
   index: `${ PREFIX }-${ index }`
 })
}

export default {
  create,
  createMapping,
  checkExistsIndex,
  get,
  remove,
  replace,
  searchWithParams,
  searchWithoutParams
}
