import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/file'

const FILE_VERSION = config.elasticsearch.fileVersion
const TYPE_NAME = `${ FILE_VERSION }-media`

const list = async (projectIdentifier, params) => {
  const existsIndex = await elasticsearchService.checkExistsIndex(`${ FILE_VERSION }-${ projectIdentifier }`)

  if (!existsIndex) {
    return null
  }

  const { pattern, preset, contentType } = params

  if (!projectIdentifier) {
    return null
  }

  if (preset) {
    return await elasticsearchService.searchByPresetHash(`${ FILE_VERSION }-${ projectIdentifier }`, TYPE_NAME, preset)
  }

  if (contentType) {
    return await elasticsearchService.searchByContentType(`${ FILE_VERSION }-${ projectIdentifier }`, TYPE_NAME, contentType)
  }

  if (pattern) {
    return await elasticsearchService.searchByPattern(`${ FILE_VERSION }-${ projectIdentifier }`, TYPE_NAME, pattern)
  }

  return await elasticsearchService.searchByProject(`${ FILE_VERSION }-${ projectIdentifier }`, TYPE_NAME)
}

const get = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  const existsIndex = await elasticsearchService.checkExistsIndex(projectIdentifier)

  if (!existsIndex) {
    return null
  }

  return await elasticsearchService.get(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

const create = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  const { result } = await elasticsearchService.create(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier,
    mapping,
    params
  )

  if (result !== 'created') {
    return null
  }

  return params
}

const replace = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.replace(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier,
    mapping,
    params
  )
}

const remove = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  const existsIndex = await elasticsearchService.checkExistsIndex(projectIdentifier)

  if (!existsIndex) {
    return null
  }

  return await elasticsearchService.remove(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

const head = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.head(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

const prune = async (projectIdentifier, { lastSynchronized, maxKeys }) => {
  if (!projectIdentifier || !lastSynchronized) {
    return null
  }

  const existsIndex = await elasticsearchService.checkExistsIndex(projectIdentifier)

  if (!existsIndex) {
    return null
  }

  const params = {
    bool: {
      must: [ {
        range: {
          lastSynchronized: {
            lt: new Date(lastSynchronized)
          }
        }
      } ]
    }
  }

  const listFiles = await elasticsearchService.searchAllObjects(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    params
  )

  if (!listFiles) {
    return null
  }

  const { deleted } = await elasticsearchService.removeWithParams(
    `${ FILE_VERSION }-${ projectIdentifier }`,
    TYPE_NAME,
    params,
    maxKeys
  )

  const isTruncated = listFiles.length !== deleted

  return {
    deleted,
    isTruncated
  }
}

export default {
  create,
  get,
  head,
  list,
  prune,
  remove,
  replace
}
