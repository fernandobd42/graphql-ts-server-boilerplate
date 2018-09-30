import { Connection } from 'typeorm'

import { CreateTypeOrmConnection } from './../../utils/CreateTypeOrmConnection'
import { User } from '../../entity/User'
import { TestClient } from '../../utils/TestClient'

let userId: string
let conn: Connection
const email = "testemail@gmail.com"
const password = "passwordtest"

beforeAll(async () => {
  conn = await CreateTypeOrmConnection()
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save()
  userId = user.id
})

afterAll(async () => {
  conn.close()
})

describe("me", () => {
  test("return null if no cookie", async () => {
    const client = new TestClient(process.env.TEST_HOST as string)
    const response = await client.me()
    expect(response.data.me).toBeNull()
  })

  test("get current user", async () => {
    const client = new TestClient(process.env.TEST_HOST as string)
    await client.login(email, password)
    const response = await client.me()

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    })
  })
})