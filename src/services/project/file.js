import elasticSearch from 'infrastructure/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/media'

const PREFIX = config.aws.elasticsearch.prefix
const TYPE_NAME = `${ PREFIX }-media`

const initMapping = async (index) => {
  const indexExists = await elasticSearch.indices.exists({
    index: `${ PREFIX }-${ index }`
  })

  if (indexExists) {
    return
  }

  await elasticSearch.indices.create({
    index: `${ PREFIX }-${ index }`
  })

  return await elasticSearch.indices.putMapping({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    body: {
      properties: mapping
    }
  })
}

const list = async (projectIdentifier, { from, size }) => {
  return await elasticSearch.search({
    from,
    size,
    index: `${ PREFIX }-${ projectIdentifier }`,
    type: TYPE_NAME
  })
}

const get = async (projectIdentifier, id) => {
  return await elasticSearch.get({
    index: `${ PREFIX }-${ projectIdentifier }`,
    type: TYPE_NAME,
    id
  })
}

const createOrReplace = async (index, id, params) => {
  await initMapping(index)

  const objectExists = await elasticSearch.exists({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id
  })

  if (objectExists) {
    return await elasticSearch.update({
      index: `${ PREFIX }-${ index }`,
      type: TYPE_NAME,
      id,
      body: {
        doc: params
      }
    })
  } else {
    return await elasticSearch.create({
      index: `${ PREFIX }-${ index }`,
      type: TYPE_NAME,
      id,
      body: params
    })
  }
}

const remove = async (index, id) => {
  return await elasticSearch.delete({
    index: `${ PREFIX }-${ index }`,
    type: TYPE_NAME,
    id
  })
}

export default {
  createOrReplace,
  get,
  list,
  remove
}
