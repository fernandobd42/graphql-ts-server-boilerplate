import { Connection } from "typeorm"
import * as Redis from "ioredis"

import { CreateTypeOrmConnection } from "../../utils/CreateTypeOrmConnection"
import { User } from "../../entity/User"
import { TestClient } from "../../utils/TestClient"
import { createForgotPasswordLink } from './../../utils/createForgotPasswordLink'

let conn: Connection
export const redis = new Redis();
const email = "bob5@bob.com"
const password = "jlkajoioiqwe"
const newPassword = "qowuieoiqwueoq"
let userId: string

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

 describe("forgot password", () => {
  test("make sure it works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string)

    const url = await createForgotPasswordLink("", userId, redis)
    const parts = url.split("/")
    const key = parts[parts.length - 1]

    const response = await client.forgotPasswordChange(newPassword, key)
    expect(response.data).toEqual({
      forgotPasswordChange: null
    })

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    })
  })
})