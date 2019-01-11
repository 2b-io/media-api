import elasticsearch from 'elasticsearch'

import config from 'infrastructure/config'

const state = {
  client: null
}

const connect = async () => {
  if (state.client === null) {
    state.client = new elasticsearch.Client({
      host: config.elasticsearch.host,
      log: 'trace'
    })
    console.log('Elasticsearch connected!')
  } else {
    console.log('Reuse alive Elasticsearch connection.')
  }

  return state
}

const createMapping = async (index, type, mapping) => {
  const { client } = await connect()

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

  const { client } = await connect()

  return await client.create({
    index,
    type,
    id,
    body: params
  })
}

const replace = async (index, type, id, , mapping, params) => {
  await createMapping(index, type, mapping)

  const { client } = await connect()

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
  const { client } = await connect()

  const object = await client.get({
    index,
    type,
    id
  })

  return object._source
}

const remove = async (index, type, id) => {
  const { client } = await connect()

  return await client.delete({
    index,
    type,
    id
  })
}

const removeWithParams = async (index, type, params, size) => {
  const { client } = await connect()

  return await client.deleteByQuery({
    index,
    type,
    size,
    body: {
      query: {
       ...params
      }
    }
  })
}

const searchWithParams = async (index, type, params, { from, size }) => {
  const { client } = await connect()

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
  const { client } = await connect()

  return await client.search({
    from,
    size,
    index,
    type
  })
}

const checkExistsIndex = async (index) => {
  const { client } = await connect()

  return await client.indices.exists({
   index
 })
}
const checkExistsObject = async (index, type, id) => {
  const { client } = await connect()

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
  removeWithParams,
  replace,
  searchWithParams,
  searchWithoutParams
}
