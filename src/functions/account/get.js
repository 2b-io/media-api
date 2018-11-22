import endpoint from 'rest/endpoint'

export default endpoint(
  async (event) => {
    const { identifier } = event.pathParameters

    return {
      statusCode: 201,
      resource: {
        identifier
      }
    }
  }
)
