import {
  EntityName,
  FilterQuery,
  MikroORM,
  QueryOrder,
  QueryOrderMap,
} from "@mikro-orm/core"
import { DataSource, EntityManager as TypeOrmEntityManager } from "typeorm"
import { AutoPath } from "@mikro-orm/core/typings"
import { EntityManager as MikroOrmEntityManager } from "@mikro-orm/mysql"
import { PaginatedData, QueryInput } from "./typings"
import { User } from "./User.mikro"
import { User as TypeUser } from "./User.type"

// export const paginate = async <T>(
//   manager: MikroOrmEntityManager | TypeOrmEntityManager,
//   entity: EntityName<T> | EntityTarget<T>,
//   queryInput: QueryInput,
//   options?:
// ) => {}

export const paginateMikroOrm = async <T, P extends string>(
  manager: MikroOrmEntityManager,
  entity: EntityName<T>,
  paginationInput: QueryInput,
  whereQuery: FilterQuery<T>,
  populate?: readonly AutoPath<T, P>[] | boolean,
  orderByReplacement?: QueryOrderMap<T> | QueryOrderMap<T>[]
): Promise<PaginatedData<T>> => {
  const [data, total] = await manager.findAndCount(entity, whereQuery, {
    limit: paginationInput.limit,
    orderBy:
      orderByReplacement ??
      ({
        [paginationInput.sort ?? "id"]:
          paginationInput.order ?? QueryOrder.DESC,
      } as QueryOrderMap<T>),
    offset: paginationInput.offset
      ? paginationInput.offset
      : paginationInput.page * (paginationInput.limit ?? 0),
    populate,
  })

  const paginatedData = new PaginatedData<T>(data, total, paginationInput.limit)

  return paginatedData
}

export const test = async () => {
  const typeOrmDataSource = new DataSource({
    username: "root",
    password: "root",
    database: "paginator-mikro",
    type: "mysql",
    synchronize: true,
    entities: ["src/*.type.ts"],
  })

  await typeOrmDataSource.initialize()

  const typeManager: TypeOrmEntityManager =
    typeOrmDataSource.createEntityManager()

  const newTypeUser = typeManager.create(TypeUser, {
    name: "alex",
    address: "Aristotelous",
    age: 24,
    username: "alex1",
  })

  await typeManager.insert(TypeUser, newTypeUser)

  const mikro = await MikroORM.init()

  const MikroOrmManager: MikroOrmEntityManager =
    mikro.em.fork() as MikroOrmEntityManager

  const newUser = MikroOrmManager.create(User, {
    name: "alex",
    address: "Aristotelous",
    age: 24,
    username: "alex1",
  })

  await MikroOrmManager.persistAndFlush(newUser)
}

test().catch((e) => {
  console.log(e)
})
