import elasticsearchService from 'services/elasticsearch'
import elasticsearchInfra from 'infrastructure/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const DATAPOINT_VERSION = config.elasticsearch.datapointVersion

const head = async (projectIdentifier, metricName, timestamp) => {
  return await elasticsearchService.head(
    `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
    metricName,
    timestamp
  )
}

const update = async (projectIdentifier, metricName, data) => {
  if (!projectIdentifier || !metricName) {
    return null
  }

  const result = await data.map(async ({ timestamp, value }) => {
    return await elasticsearchService.create(
      `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
      metricName,
      timestamp,
      mapping,
      { timestamp, value }
    )
  })

  if (!result) {
    return null
  }

  return data
}

const get = async (projectIdentifier, metricName, data) => {
  if (!projectIdentifier || !metricName) {
    return null
  }

  const { startTime, endTime, period, from, size = 500 } = data

  const { hits } = await elasticsearchInfra.searchWithParams(
    `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
    metricName,
    {
      range: {
        timestamp: {
          gte: startTime,
          lte: endTime
        }
      }
    },
    {
      from,
      size
    }
  )

  if (!hits || !hits.hits.length) {
    return {
      listData: [],
      total: 0
    }
  }

  return {
    listData: hits.hits,
    total: hits.total
  }
}

export default {
  get,
  update,
  head
}
