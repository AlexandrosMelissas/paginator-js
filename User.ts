import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm"
import { PrimaryKey, Property } from "@mikro-orm/core"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string
}

@Entity()
export class MikroUser {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string
}
