import axios from 'axios'
import { Connection } from 'typeorm'

import { CreateTypeOrmConnection } from './../../utils/CreateTypeOrmConnection'
import { User } from '../../entity/User'

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

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`

const meQuery = `
  {
    me {
      id
      email
    }
  }
`

describe("me", () => {
  test("return null if no cookie", async () => {
    const response = await axios.post(process.env.TEST_HOST as string, {
      query: meQuery
    })
    expect(response.data.data.me).toBeNull()
  })

  test("get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    )

    const response = await axios.post(
      process.env.TEST_HOST as string, 
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    )

    console.log("RESPOSTAAA ", response.data.data)
    expect(response.data.data).toEqual({
      me: {
        id: userId,
        email
      }
    })
  })
})