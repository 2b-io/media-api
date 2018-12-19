import ms from 'ms'

import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const DATAPOINT_VERSION = config.elasticsearch.datapointVersion

const generateRangeTimes = (startTime, endTime, period) => {
  let timePoint = startTime
  let dates = []

  while (timePoint < endTime && timePoint < Date.now()) {
    dates.push(timePoint)
    timePoint += period * 1000
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

  const datapoints = originRangeTimes.map((time) => ({
    timestamp: time,
    value: indices[ time ] || 0
  }))

  return datapoints
}

const update = async (projectIdentifier, metricName, data) => {
  if (!projectIdentifier || !metricName) {
    return null
  }

  return await Promise.all(
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

  return await formatResponseData(metricData, { startTime, endTime, period })
}

export default {
  get,
  update
}
