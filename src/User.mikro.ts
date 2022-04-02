import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"

@Entity({ tableName: "user" })
export class MikroUser {
  @PrimaryKey()
  id: string = v4()

  @Property()
  name: string

  @Property()
  email: string

  @Property()
  username: string

  @Property()
  address: string

  @Property()
  age: number
}

@Entity()
export class Car {
  @PrimaryKey()
  id: string
}
