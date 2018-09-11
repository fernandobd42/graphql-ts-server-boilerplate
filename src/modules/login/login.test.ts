import { Connection } from 'typeorm'

import { invalidLogin, confirmEmailError } from "./errorMessages"
import { User } from "../../entity/User"
import { CreateTypeOrmConnection } from "../../utils/CreateTypeOrmConnection"
import { TestClient } from "../../utils/TestClient"

const email = 'testemail@gmail.com'
const password = 'paswordtest'

let conn: Connection
beforeAll(async () => {
  conn = await CreateTypeOrmConnection()
})
afterAll(async () => {
  conn.close()
})

const loginExpectError = async (
  client: TestClient,
  e: string,
  p: string,
  errMsg: string
) => {
  const response = await client.login(e, p)

  expect(response.data).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  })
}

describe("login", () => {
  test("email not found send back error", async () => {
    const client = new TestClient(process.env.TEST_HOST as string)
    await loginExpectError(client, "bob@bob.com", "whatever", invalidLogin)
  })

  test("email not confirmed", async () => {
    const client = new TestClient(process.env.TEST_HOST as string)
    await client.register(email, password)

    await loginExpectError(client, email, password, confirmEmailError)

    await User.update({ email }, { confirmed: true })

    await loginExpectError(client, email, "aslkdfjaksdljf", invalidLogin)

    const response = await client.login(email, password)

    expect(response.data).toEqual({ login: null })
  })
})