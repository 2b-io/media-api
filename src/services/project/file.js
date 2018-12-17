import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/file'

const PREFIX = config.elasticsearch.prefix
const TYPE_NAME = `${ PREFIX }-media`

const list = async (projectIdentifier, params) => {
  const { pattern, presetHash } = params

  if (!projectIdentifier) {
    return null
  }

  if (presetHash) {
    return await elasticsearchService.searchByPresetHash(`${ PREFIX }-${ projectIdentifier }`, TYPE_NAME, presetHash)
  }

  if (pattern) {
    return await elasticsearchService.searchByPattern(`${ PREFIX }-${ projectIdentifier }`, TYPE_NAME, pattern)
  }

  return await elasticsearchService.searchByProject(`${ PREFIX }-${ projectIdentifier }`, TYPE_NAME)
}

const get = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.get(
    `${ PREFIX }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

const create = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.create(
    `${ PREFIX }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier,
    mapping,
    params
  )
}

const replace = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.replace(
    `${ PREFIX }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier,
    params
  )
}

const remove = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.remove(
    `${ PREFIX }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

const head = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.head(
    `${ PREFIX }-${ projectIdentifier }`,
    TYPE_NAME,
    fileIdentifier
  )
}

export default {
  create,
  get,
  head,
  list,
  remove,
  replace
}
