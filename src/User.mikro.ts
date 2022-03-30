import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"
@Entity()
export class User {
  @PrimaryKey()
  id: string = v4()

  @Property()
  name: string

  @Property()
  username: string

  @Property()
  address: string

  @Property()
  age: number
}
