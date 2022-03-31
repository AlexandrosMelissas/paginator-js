import { MikroUser } from "./User.mikro"
import { TypeUser } from "./User.type"
import faker from "@faker-js/faker"
import { v4 } from "uuid"
import { EntityManager as mikroEntityManager } from "@mikro-orm/mysql"
import { EntityManager as typeEntityManager } from "typeorm"

export const generate10MikroUsers = (
  manager: mikroEntityManager
): MikroUser[] => {
  let mikroUsers: MikroUser[] = []

  for (let i = 0; i < 10; i++) {
    const createdUser = manager.create(MikroUser, {
      address: faker.address.city(),
      age: faker.datatype.number(),
      email: faker.internet.email(),
      id: v4(),
      name: faker.name.firstName(),
      username: faker.internet.userName(),
    })

    mikroUsers.push(createdUser)
  }

  return mikroUsers
}

export const generate10TypeUsers = (manager: typeEntityManager): TypeUser[] => {
  let typeUsers: TypeUser[] = []

  for (let i = 0; i < 10; i++) {
    const createdUser = manager.create(TypeUser, {
      address: faker.address.city(),
      age: faker.datatype.number(),
      email: faker.internet.email(),
      id: v4(),
      name: faker.name.firstName(),
      username: faker.internet.userName(),
    })

    typeUsers.push(createdUser)
  }

  return typeUsers
}
