interface GraphQLType {
  ['Int!']: number
  ['Int']: number | undefined

  ['Float!']: number
  ['Float']: number | undefined

  ['String!']: string
  ['String']: string | undefined
}

type QueryField =
  | keyof GraphQLType
  | QueryObject
  | [QueryObject]

type QueryObject = { [key: string]: QueryField }

function transformField(key: string, value: QueryField): string {
  if (Array.isArray(value)) {
    return transformField(key, value[0])
  }
  if (typeof value === 'object') {
    return `${key} {
      ${transformObject(value)}
    }`
  }
  return `${key}: ${value};`
}

const transformObject = (object: QueryObject): string =>
  Object.keys(object)
    .map(key => transformField(key, object[key]))
    .join('\n')

export const query = (object: QueryObject): string => `query {
  ${transformObject(object)}
}`
