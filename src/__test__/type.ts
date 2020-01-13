// Unit tests for types o.O

import { queryObject, QueryReturnType } from '../index'

type AssertIs<T, K> = T extends K ? true : false

function basicQuery() {
  const userQuery = queryObject({
    id: 'Int!',
    photo: 'String',
    friends: [{
      id: 'Int!',
      photo: 'String',
    }],
  })

  type QueriedUser = QueryReturnType<typeof userQuery>

  interface User {
    id: number
    photo?: string
  }

  const _1: AssertIs<QueriedUser, User> = true
  const _2: AssertIs<QueriedUser['friends'], User[]> = true
}
