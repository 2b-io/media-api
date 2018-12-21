import elasticsearch from 'elasticsearch'

import config from 'infrastructure/config'

const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: 'trace'
})

const createMapping = async (index, type, mapping) => {
  const indexExists = await client.indices.exists({
    index
  })

  if (!indexExists) {
    await client.indices.create({
      index
    })
  }

  return await client.indices.putMapping({
    index,
    type,
    body: {
      properties: mapping
    }
  })
}

const create = async (index, type, id, mapping, params) => {
  await createMapping(index, type, mapping)

  return await client.create({
    index,
    type,
    id,
    body: params
  })
}

const replace = async (index, type, id, params) => {
  return await client.update({
    index,
    type,
    id,
    body: {
      doc: params
    }
  })
}

const get = async (index, type, id) => {
  const object = await client.get({
    index,
    type,
    id
  })

  return object._source
}

const remove = async (index, type, id) => {
  return await client.delete({
    index,
    type,
    id
  })
}

const removeWithParams = async (index, type, params, size) => {
  return await client.delete({
    size,
    index,
    type,
    body: {
      query: {
       ...params
      }
    }
  })
}

const searchWithParams = async (index, type, params, { from, size }) => {
  return await client.search({
    from,
    size,
    index,
    type,
    body: {
      query: {
        ...params
      }
    }
  })
}

const searchWithoutParams = async (index, type, { from, size }) => {
  return await client.search({
    from,
    size,
    index,
    type
  })
}

const checkExistsIndex = async (index) => {
  return await client.indices.exists({
   index
 })
}
const checkExistsObject = async (index, type, id) => {
  return await client.exists({
    index,
    type,
    id
  })
}

export default {
  create,
  createMapping,
  checkExistsIndex,
  checkExistsObject,
  get,
  remove,
  replace,
  searchWithParams,
  searchWithoutParams
}
