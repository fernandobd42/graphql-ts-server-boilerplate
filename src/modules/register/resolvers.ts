import * as bcrypt from 'bcryptjs'

import { ResolverMap } from '../../types/graphql-utils'
import { User } from '../../entity/User'

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "Bye"
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const userAlreadyExists = await User.findOne({ where: { email }, select: ["id"] })
      if (userAlreadyExists) {
        return [
          {
             path: "email",
             message: "email already taken"
          }
        ]
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({
        email,
        password: hashedPassword
      })

      await user.save()
      return null
    }
  }
}
