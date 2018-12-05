import elasticSearch from 'infrastructure/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/media'
import searchService from 'services/elasticsearch'

const PREFIX = config.aws.elasticsearch.prefix
const TYPE_NAME = `${ PREFIX }-media`

const searchByProject = async (projectIdentifier) => {
  return await searchService.searchAllObjects({
    projectIdentifier
  })
}

const searchByPatterns = async (projectIdentifier, patterns) => {
  const originObjects = await patterns.reduce(
    async (previousJob, pattern) => {
      const prevObjects = await previousJob || []
      const nextObjects = await searchService.searchAllObjects({
        projectIdentifier,
        params: {
          regexp: {
            originUrl: pattern.endsWith('*') ?
              `${ escape(pattern.substring(0, pattern.length - 1)) }.*` :
              `${ escape(pattern) }.*`
          }
        }
      })

      return [ ...prevObjects, ...nextObjects ]
    }, Promise.resolve()
  )

  if (!originObjects.length) {
    return []
  }

  const allObjects = await originObjects.reduce(
    async (previousJob, { key: originKey }) => {
      const prevObjects = await previousJob || []
      const nextObjects = await searchService.searchAllObjects({
        projectIdentifier,
        params: {
          regexp: {
            key: `${ escape(originKey) }.*`
          }
        }
      })

      return [ ...prevObjects, ...nextObjects ]
    }, Promise.resolve()
  )

  return allObjects
}

const searchByPresetHash = async (projectIdentifier, presetHash) => {
  return await searchService.searchAllObjects({
    projectIdentifier,
    params: {
      term: {
        preset: presetHash
      }
    }
  })
}

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

const list = async (projectIdentifier, params) => {
  const { patterns, presetHash } = params

  if (!projectIdentifier) {
    return null
  }

  if (presetHash) {
    return await searchByPresetHash(projectIdentifier, presetHash)
  }

  if (patterns) {
    return await searchByPatterns(projectIdentifier, patterns)
  }

  return await searchByProject(projectIdentifier)
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
