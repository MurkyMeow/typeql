interface GraphQLType {
  ['Int!']: number
  ['Int']: number | undefined

  ['Float!']: number
  ['Float']: number | undefined

  ['String!']: string
  ['String']: string | undefined
}

type GraphQLOperation = 'query' | 'mutation' | 'subscription'

type QueryField =
  | keyof GraphQLType
  | QueryObject
  | [QueryField]

type QueryObject = { [key: string]: QueryField }

type QueryFieldType<T extends QueryField> =
  T extends keyof GraphQLType ? GraphQLType[T]
  : T extends QueryObject ? QueryReturnType<T>
  : T extends [QueryField] ? QueryFieldType<T[0]>[]
  : never

export type QueryReturnType<T extends QueryObject> = {
  [K in keyof T]: QueryFieldType<T[K]>
}

function transformField(key: string, value: QueryField): string {
  if (Array.isArray(value)) {
    return transformField(key, value[0])
  }
  if (typeof value === 'object') {
    return `${key}{${transformObject(value)}}`
  }
  return key
}

const transformObject = (object: QueryObject): string =>
  Object.keys(object)
    .map(key => transformField(key, object[key]))
    .join(' ')

/**
 * Transforms QueryObject into an actual GraphQL string
*/
export const transform = (operation: GraphQLOperation, name: string, object: QueryObject): string =>
  `${operation} ${name}{${transformObject(object)}}`

/**
 * Doesn't do anything with the argument but helps
 * typescript infer the right types
*/
export const queryObject = <T extends QueryObject>(arg: T): T => arg
