import tape from 'tape'
import { transform } from '../index'

const gql = ([literal]: TemplateStringsArray) => literal
  .replace(/\n/g, '')
  .replace(/ +/g, ' ')
  .replace(/^ /, '')
  .replace(/ $/, '')
  .replace(/ ?({|}|:|,) ?/g, '$1')
  .replace(/\.\.\. /g, '...')

tape('transform query', t => {
  const actual = transform('query', 'Me', {
    me: {
      id: 'Int!',
      photo: 'String',
      friends: [{
        id: 'Int!',
        photo: 'String',
      }],
    },
  })
  const expected = gql`
    query Me {
      me {
        id
        photo
        friends {
          id
          photo
        }
      }
    }
  `
  t.strictEqual(actual, expected)
  t.end()
})
