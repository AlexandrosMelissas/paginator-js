import {
  EntityName,
  FilterQuery,
  MikroORM,
  QueryOrder,
  QueryOrderMap,
} from "@mikro-orm/core"
import {
  DataSource,
  EntityManager as TypeOrmEntityManager,
  EntityTarget,
} from "typeorm"
import { AutoPath } from "@mikro-orm/core/typings"
import { EntityManager as MikroOrmEntityManager } from "@mikro-orm/mysql"
import { PaginatedData, QueryInput } from "./typings"
import { MikroUser } from "./User"

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
    database: "paginator",
    type: "mysql",
  })

  await typeOrmDataSource.initialize()

  const _: TypeOrmEntityManager = typeOrmDataSource.createEntityManager()

  const mikro = await MikroORM.init({
    user: "root",
    password: "root",
    dbName: "paginator",
    type: "mysql",
  })

  const MikroOrmManager: MikroOrmEntityManager =
    mikro.em as MikroOrmEntityManager

  const k = MikroOrmManager.create(MikroUser, { name: "alex", id: "1" })

  await MikroOrmManager.persistAndFlush(k)
}

test().catch((e) => {
  console.log(e)
})
