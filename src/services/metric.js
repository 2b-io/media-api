import elasticsearchService from 'services/elasticsearch'
import config from 'infrastructure/config'
import mapping from 'mapping/metric'

const PREFIX = config.elasticsearch.prefix

const update = async (projectIdentifier, metricName, data) => {

  if (!projectIdentifier || !metricName) {
    return null
  }

  const checkExistsData = await elasticsearchService.head(
    `${ PREFIX }-${ projectIdentifier }`,
    metricName,
    data.timestamp
  )

  if (checkExistsData) {
    return await elasticsearchService.replace(
      `${ PREFIX }-${ projectIdentifier }`,
      metricName,
      data.timestamp,
      { timestamp: new Date(data.timestamp), value: data.value }
    )
  }

  return await elasticsearchService.create(
    `${ PREFIX }-${ projectIdentifier }`,
    metricName,
    data.timestamp,
    mapping,
    { timestamp: new Date(data.timestamp), value: data.value }
  )
}

export default {
  update
}
