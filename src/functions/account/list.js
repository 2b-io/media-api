import endpoint from 'rest/endpoint'

export default endpoint(
  async (event) => {
    return {
      statusCode: 200,
      resource: []
    }
  }
)
