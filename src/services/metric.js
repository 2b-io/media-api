import ms from 'ms'

import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const DATAPOINT_VERSION = config.elasticsearch.datapointVersion

const generateRangeTimes = (startTime, endTime) => {
  let timePoint = startTime
  let dates = []

  while (timePoint < endTime && timePoint < Date.now()) {
    dates.push(timePoint)
    timePoint += 60 * 1000
  }

  return dates
}

const formatResponseData = (metricData, { startTime, endTime, period }) => {
  const originRangeTimes = generateRangeTimes(Number(startTime), Number(endTime), Number(period))

  const indices = metricData.reduce(
    (indices, datapoint ) => ({
      ...indices,
      [ new Date(datapoint.timestamp).getTime() ]: datapoint.value
    }),
    {}
  )

  const originDatapoints = originRangeTimes.map((time) => ({
    timestamp: time,
    value: indices[ time ] || 0
  }))

  let datapoints = []

  originDatapoints.forEach(
    (datapoint) => {
      const { timestamp, value } = datapoint

      const index = Math.floor((timestamp - startTime) / (period * 60 * 1000))

      if (!datapoints[ index ]) {
        datapoints[ index ] = {
          timestamp: new Date(timestamp).toISOString(),
          value: 0
        }
      }

      datapoints[ index ].value += value
    }
  )

  return datapoints
}

const update = async (projectIdentifier, metricName, data) => {
  if (!projectIdentifier || !metricName) {
    return null
  }
  const result = await Promise.all(
    data.map(async ({ timestamp, value }) => {
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
           { timestamp: new Date(timestamp), value }
         )
       }

       return await elasticsearchService.create(
         `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
         metricName,
         timestamp,
         mapping,
         { timestamp: new Date(timestamp), value }
       )
     })
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

  const { startTime, endTime, period } = data

  const metricData = await elasticsearchService.list(
    `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
    metricName,
    {
      range: {
        timestamp: {
          gte: startTime,
          lte: endTime,
        }
      }
    }
  )

  return await formatResponseData(metricData, { startTime: Date.parse(startTime), endTime: Date.parse(endTime), period })
}

export default {
  get,
  update
}
