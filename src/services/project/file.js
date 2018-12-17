import elasticsearchService from 'services/elasticsearch'

const list = async (projectIdentifier, params) => {
  const { pattern, presetHash } = params

  if (!projectIdentifier) {
    return null
  }

  if (presetHash) {
    return await elasticsearchService.searchByPresetHash(projectIdentifier, presetHash)
  }

  if (pattern) {
    return await elasticsearchService.searchByPattern(projectIdentifier, pattern)
  }

  return await elasticsearchService.searchByProject(projectIdentifier)
}

const get = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.get(projectIdentifier, fileIdentifier)
}

const create = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.create(projectIdentifier, fileIdentifier, params)
}

const replace = async (projectIdentifier, fileIdentifier, params) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.replace(projectIdentifier, fileIdentifier, params)
}

const remove = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.remove(projectIdentifier, fileIdentifier)
}

const head = async (projectIdentifier, fileIdentifier) => {
  if (!projectIdentifier || !fileIdentifier) {
    return null
  }

  return await elasticsearchService.head(projectIdentifier, fileIdentifier)
}

export default {
  create,
  get,
  head,
  list,
  remove,
  replace
}
