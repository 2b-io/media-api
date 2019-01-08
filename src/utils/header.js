export const normalizeHttpHeaders = (headers) => Object.entries(headers).reduce(
  (headers, [ name, value ]) => ({
    ...headers,
    [ name.toLocaleLowerCase() ]: value
  }),
  {}
)

export const parseAuthorizationHeader = (value) => {
  const [ type, params ] = value.split(' ')

  return {
    type,
    ...(
      params.split(',').reduce(
        (map, pair) => {
          const [ name, value ] = pair.split('=')

          return {
            ...map,
            [ name ]: value
          }
        }, {}
      )
    )
  }
}
