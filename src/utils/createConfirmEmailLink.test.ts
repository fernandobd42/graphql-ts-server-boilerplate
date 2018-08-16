import * as Redis from 'ioredis'
import fetch from 'node-fetch'

import { CreateTypeOrmConnection } from './CreateTypeOrmConnection'
import { createConfirmEmailLink } from './createConfirmEmailLink'
import { User } from '../entity/User'

let userId = ""
const redis = new Redis()

beforeAll(async () => {
    await CreateTypeOrmConnection()
    const user = await User.create({
        email: "bobTest@gmail.com",
        password: "jhdjhfj4"
    }).save()
     userId = user.id
})

describe("test createConfirmEmail", () => {
    test("Make sure it confirms user and clears key in redis", async () => {
        const url = await createConfirmEmailLink(process.env.TEST_HOST as string, userId, redis)
    
        const response = await fetch(url)
        const text = await response.text()
        expect(text).toEqual("ok")
        const user = await User.findOne({ where: { id: userId }})
        expect((user as User).confirmed).toBeTruthy()
        const chunks = url.split('/')
        const key = chunks[chunks.length - 1]
        const value = await redis.get(key)
        expect(value).toBeNull()
    })

    test("sends invalid back if bad id sent", async () => {
        const response = await fetch(`${process.env.TEST_HOST}/confirm/4200`)
        const text = await response.text()
        expect(text).toEqual("bad")
    })

})