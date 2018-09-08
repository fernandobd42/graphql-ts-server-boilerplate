import { request } from "graphql-request"
import { Connection } from 'typeorm'

import { invalidLogin, confirmEmailError } from "./errorMessages"
import { User } from "../../entity/User"
import { CreateTypeOrmConnection } from "../../utils/CreateTypeOrmConnection"

const email = 'testemail@gmail.com'
const password = 'paswordtest'
 
const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`

let conn: Connection
beforeAll(async () => {
  conn = await CreateTypeOrmConnection()
})
afterAll(async () => {
  conn.close()
})

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  )
   expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  })
}
 
describe("login", () => {
  it("email not found send back error", async () => {
    await loginExpectError("bob@bob.com", "whatever", invalidLogin)
  })

  it("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    )
    await loginExpectError(email, password, confirmEmailError)
    await User.update({ email }, { confirmed: true })
    await loginExpectError(email, "aslkdfjaksdljf", invalidLogin)
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    )

     expect(response).toEqual({ login: null })
  })
})