import {
  EntityName,
  FilterQuery,
  QueryOrder,
  QueryOrderMap,
  MikroORM,
  EntityManager as MikroOrmEntityManager,
  EntityManager,
} from "@mikro-orm/core"
import {
  EntityManager as TypeOrmEntityManager,
  EntityTarget,
  FindOptionsRelations,
  FindOptionsWhere,
} from "typeorm"
import { AutoPath } from "@mikro-orm/core/typings"
import { PaginatedData, QueryInput } from "./typings"
import { MikroUser } from "./User.mikro"
export const paginate = async <
  T,
  M extends MikroOrmEntityManager | TypeOrmEntityManager,
  P extends string
>(
  manager: M,
  entity: M extends MikroOrmEntityManager ? EntityName<T> : EntityTarget<T>,
  queryInput: QueryInput,
  whereQuery: M extends MikroOrmEntityManager
    ? FilterQuery<T>
    : FindOptionsWhere<T>,
  populate?: M extends MikroOrmEntityManager
    ? readonly AutoPath<T, P>[] | boolean
    : FindOptionsRelations<T>
): Promise<PaginatedData<T>> => {
  // TODO Figure out a way to identify types based on instance so that we dont use AS keyword
  if (manager instanceof MikroOrmEntityManager) {
    return await paginateMikroOrm(
      manager,
      entity as EntityName<T>,
      queryInput,
      whereQuery as FilterQuery<T>,
      populate as readonly AutoPath<T, P>[] | boolean
    )
  }

  return paginateTypeOrm(
    manager,
    entity as EntityTarget<T>,
    queryInput,
    whereQuery as FindOptionsWhere<T>,
    populate as FindOptionsRelations<T>
  )
}

export const paginateTypeOrm = async <T>(
  manager: TypeOrmEntityManager,
  entity: EntityTarget<T>,
  queryInput: QueryInput,
  where: FindOptionsWhere<T>,
  relations?: FindOptionsRelations<T>
): Promise<PaginatedData<T>> => {
  const [data, total] = await manager.findAndCount(entity, {
    where,
    take: queryInput.limit,
    skip: queryInput.offset ?? queryInput.page * (queryInput.limit ?? 0),
    relations,
  })

  const paginatedData = new PaginatedData<T>(data, total, queryInput.limit)

  return paginatedData
}

export const paginateMikroOrm = async <T, P extends string>(
  manager: MikroOrmEntityManager,
  entity: EntityName<T>,
  queryInput: QueryInput,
  whereQuery: FilterQuery<T>,
  populate?: readonly AutoPath<T, P>[] | boolean,
  orderByReplacement?: QueryOrderMap<T> | QueryOrderMap<T>[]
): Promise<PaginatedData<T>> => {
  // Find and count
  const [data, total] = await manager.findAndCount(entity, whereQuery, {
    limit: queryInput.limit ?? undefined,
    orderBy:
      orderByReplacement ??
      ({
        [queryInput.sort ?? "id"]: queryInput.order ?? QueryOrder.DESC,
      } as QueryOrderMap<T>),
    offset: queryInput.offset
      ? queryInput.offset
      : queryInput.page * (queryInput.limit ?? 0),
    populate,
  })

  const paginatedData = new PaginatedData<T>(data, total, queryInput.limit)

  return paginatedData
}

export const test = async () => {
  // const typeOrmDataSource = new DataSource({
  //   username: "root",
  //   password: "root",
  //   database: "paginator-type",
  //   type: "mysql",
  //   synchronize: true,
  //   entities: ["src/*.type.ts"],
  // })

  // await typeOrmDataSource.initialize()

  // const qwdqw: TypeOrmEntityManager = typeOrmDataSource.createEntityManager()

  // const k = await typeManager.findAndCount(TypeUser, { relations: [] })

  const mikro = await MikroORM.init()

  const mikroManager = mikro.em.fork() as EntityManager

  const users = await paginate(
    mikroManager,
    MikroUser,
    { page: 0, limit: 0 },
    {}
  )

  console.log(users)

  // const k = await paginate(TypeUser, typeManager, {
  //   limit: 0,
  //   page: 0,
  // })

  // const typeUsers = generate10TypeUsers(typeManager)

  // await typeManager.insert(TypeUser, typeUsers)

  // const mikroUsers = generate10MikroUsers(MikroOrmManager)

  // await MikroOrmManager.persistAndFlush(mikroUsers)
}

test().catch((e) => {
  console.log(e)
})
