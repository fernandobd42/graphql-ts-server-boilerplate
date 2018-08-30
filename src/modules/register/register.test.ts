import { request } from 'graphql-request'
import { Connection } from 'typeorm'

import { User } from './../../entity/User'
import { CreateTypeOrmConnection } from './../../utils/CreateTypeOrmConnection'
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from './errorMessages'

const email = 'testf@gmail.com'
const password = 'dsbdnd'

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
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

describe('Register User', async () => {
  it("check for duplicate emails", async () => {
    // make sure we can register a user
    const response = await request(process.env.TEST_HOST as string, mutation(email, password))
    expect(response).toEqual({ register: null })
    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)
    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)
  
    const response2: any = await request(process.env.TEST_HOST as string, mutation(email, password))
    expect(response2.register).toHaveLength(1)
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    })
  })

  it("check bad email", async () => {
    const response3: any = await request(process.env.TEST_HOST as string, mutation("ex", password))
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        }
      ]
    })
  })  

  it("check bad password", async () => {
    const response4: any = await request(process.env.TEST_HOST as string, mutation(email, "ex"))
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    })
  })

  it("check bad email and bad password", async () => {
    const response5: any = await request(process.env.TEST_HOST as string, mutation("ex", "ex"))
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    })
  })
})
