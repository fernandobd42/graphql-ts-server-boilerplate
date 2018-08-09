import { request } from 'graphql-request'
import { createConnections } from 'typeorm'
import { host } from './constants'
import { User } from '../entity/User'

const email = 'jao@gmail.com'
const password = 'lalala'

const mutation = `
    mutation {
        register(email: "${email}", password: "${password}")
    }
`
test('Register User', async () => {
  const response = await request(host, mutation)
  expect(response).toEqual({ register: true })
  await createConnections()
  const users = await User.find({ where: { email } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)
})
