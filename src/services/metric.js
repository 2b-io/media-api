import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const DATAPOINT_VERSION = config.elasticsearch.datapointVersion

const update = async (projectIdentifier, metricName, data) => {

  if (!projectIdentifier || !metricName) {
    return null
  }

  return await Promise.all(
    data.map(async ({ timestamp, value }) => {
       const checkExistsData = await elasticsearchService.head(
         `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
         `${ metricName }`,
         timestamp
       )

       if (checkExistsData) {
         return await elasticsearchService.replace(
           `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
           `${ metricName }`,
           timestamp,
           { timestamp: new Date(timestamp), value }
         )
       }

       return await elasticsearchService.create(
         `${ DATAPOINT_VERSION }-${ projectIdentifier }-${ metricName }`,
         `${ metricName }`,
         timestamp,
         mapping,
         { timestamp: new Date(timestamp), value }
       )
     })
  )
}

export default {
  update
}
