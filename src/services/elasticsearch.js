import elasticsearch from 'infrastructure/elasticsearch'

const searchAllObjects = async (projectIdentifier, type, pageSize = 10, params) => {
  const projectExists = await elasticsearch.checkExistsIndex(projectIdentifier)

  if (!projectExists) {
    return []
  }

  let totalHits = 0
  let total = 0
  let sources = []

  do {
    const {
      hits: {
        total: _total,
        hits
      }
    } = params ?
      await elasticsearch.searchWithParams(
        projectIdentifier,
        type,
        params,
        { from: totalHits, size: pageSize }
      ) :
      await elasticsearch.searchWithoutParams(
        projectIdentifier,
        type,
        { from: totalHits, size: pageSize }
      )

    totalHits = totalHits + hits.length
    total = _total

    sources = [
      ...sources,
      ...hits.map(({ _source }) => _source)
    ]
  } while (totalHits < total)

  return sources
}

const create = async (projectIdentifier, type, fileIdentifier, mapping, params) => {
  return await elasticsearch.create(projectIdentifier, type, fileIdentifier, mapping, params)
}

const replace = async (projectIdentifier, type, fileIdentifier, params) => {
  return await elasticsearch.replace(projectIdentifier, type, fileIdentifier, params)
}

const get = async (projectIdentifier, type, fileIdentifier) => {
  return await elasticsearch.get(projectIdentifier, type, fileIdentifier)
}

const remove = async (projectIdentifier, type, fileIdentifier) => {
  return await elasticsearch.remove(projectIdentifier, type, fileIdentifier)
}

const head = async (projectIdentifier, type, fileIdentifier) => {
  return await elasticsearch.checkExistsObject(projectIdentifier, type, fileIdentifier)
}

const searchByProject = async (projectIdentifier, type) => {
  const allObjects = await searchAllObjects(
    projectIdentifier,
    type
  )

  return allObjects || []
}

const searchByPattern = async (projectIdentifier, type, pattern) => {
  const originObjects = await searchAllObjects(
    projectIdentifier,
    type,
    { regexp: {
        originUrl: pattern.endsWith('*') ?
          `${ escape(pattern.substring(0, pattern.length - 1)) }.*` :
          `${ escape(pattern) }.*`
      }
    }
  )

  if (!originObjects.length) {
    return []
  }

  const allObjects = await originObjects.reduce(
    async (previousJob, { key: originKey }) => {
      const prevObjects = await previousJob || []
      const nextObjects = await searchAllObjects(
        projectIdentifier,
        type,
        { regexp: { key: `${ escape(originKey) }.*` } }
      )

      return [ ...prevObjects, ...nextObjects ]
    }, Promise.resolve()
  )

  return allObjects
}

const searchByPresetHash = async (projectIdentifier, type,presetHash) => {
  const allObjects = await searchAllObjects(
    projectIdentifier,
    type,
    { term: { preset: presetHash } }
  )

  return allObjects || []
}



export default {
  create,
  get,
  replace,
  head,
  remove,
  searchByProject,
  searchByPattern,
  searchByPresetHash
}
