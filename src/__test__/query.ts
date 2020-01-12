import tape from 'tape'
import { query } from '../index'

tape('transform query', t => {
  const actual = query({
    id: 'Int!',
    photo: 'String',
    friends: {
      id: 'Int!',
      photo: 'String',
    },
  })
  const expected = `
    query {
      id
      photo
      friends {
        id
        photo
      }
    }
  `
  t.equal(actual, expected)
})
