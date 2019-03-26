import elasticsearchService from 'services/elasticsearch'
import elasticsearchInfra from 'infrastructure/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const DATAPOINT_VERSION = config.elasticsearch.datapointVersion

const update = async (projectIdentifier, metricName, data) => {
  if (!projectIdentifier || !metricName) {
    return null
  }

  const result = await data.reduce(
    async (previousJob, { timestamp, value }) => {
      await previousJob

      const checkExistsData = await elasticsearchService.head(
        `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
        metricName,
        timestamp
      )

      if (checkExistsData) {
        return await elasticsearchService.replace(
          `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
          metricName,
          timestamp,
          mapping,
          { timestamp: new Date(timestamp), value }
        )
      } else {
        return await elasticsearchService.create(
          `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
          metricName,
          timestamp,
          mapping,
          { timestamp: new Date(timestamp), value }
        )
      }

    }, Promise.resolve()
  )

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
  update
}
