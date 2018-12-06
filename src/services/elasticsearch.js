import elasticsearch from 'infrastructure/elasticsearch'

const searchAllObjects = async (projectIdentifier, pageSize = 10, params) => {
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
        params,
        { from: totalHits, size: pageSize }
      ) :
      await elasticsearch.searchWithoutParams(
        projectIdentifier,
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

const create = async (projectIdentifier, fileIdentifier, params) => {
  return await elasticsearch.create(projectIdentifier, fileIdentifier, params)
}

const replace = async (projectIdentifier, fileIdentifier, params) => {
  return await elasticsearch.replace(projectIdentifier, fileIdentifier, params)
}

const get = async (projectIdentifier, fileIdentifier) => {
  return await elasticsearch.get(projectIdentifier, fileIdentifier)
}

const remove = async (projectIdentifier, fileIdentifier) => {
  return await elasticsearch.remove(projectIdentifier, fileIdentifier)
}

const searchByProject = async (projectIdentifier) => {
  const allObjects = await searchAllObjects(
    projectIdentifier
  )

  return allObjects || []
}

const searchByPattern = async (projectIdentifier, pattern) => {
  const originObjects = await searchAllObjects(
    projectIdentifier,
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
        { regexp: { key: `${ escape(originKey) }.*` } }
      )

      return [ ...prevObjects, ...nextObjects ]
    }, Promise.resolve()
  )

  return allObjects
}

const searchByPresetHash = async (projectIdentifier, presetHash) => {
  const allObjects = await searchAllObjects(
    projectIdentifier,
    { term: { preset: presetHash } }
  )

  return allObjects || []
}



export default {
  create,
  get,
  replace,
  remove,
  searchByProject,
  searchByPattern,
  searchByPresetHash
}
