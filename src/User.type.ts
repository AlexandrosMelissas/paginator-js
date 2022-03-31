import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm"
import { v4 } from "uuid"

@Entity()
export class TypeUser extends BaseEntity {
  @PrimaryColumn()
  id: string = v4()

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  address: string

  @Column()
  age: number
}
