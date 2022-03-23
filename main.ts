import {
  EntityName,
  FilterQuery,
  MikroORM,
  QueryOrder,
  QueryOrderMap,
} from "@mikro-orm/core"
import { AutoPath } from "@mikro-orm/core/typings"
import { EntityManager } from "@mikro-orm/mysql"
import knex, { Knex } from "knex"
import {
  ConnectionSettings,
  Library,
  PaginatedData,
  QueryInput,
} from "./typings"

export abstract class Paginator {
  private MikroOrm: MikroORM
  private Knex: Knex
  private readonly library: Library
  private connectionSettings: ConnectionSettings

  constructor(library: Library, connectionSettings: ConnectionSettings) {
    this.connectionSettings = connectionSettings
    this.library = library
  }

  static async init(): Promise<void> {
    if (this.library === "mikro-orm") {
      this.MikroOrm = await MikroORM.init({
        user: this.connectionSettings.user,
        dbName: this.connectionSettings.database,
        password: this.connectionSettings.password,
        type: this.connectionSettings.client,
        host: this.connectionSettings.host,
      })
    }

    if (this.library === "knex-js") {
      this.Knex = knex({
        client: this.connectionSettings.client,
        connection: {
          database: this.connectionSettings.database,
          host: this.connectionSettings.host,
          port: this.connectionSettings.port,
          password: this.connectionSettings.password,
          user: this.connectionSettings.user,
        },
      })
    }
  }

  public paginateMikroOrm = async <T, P extends string>(
    manager: EntityManager,
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

    const paginatedData = new PaginatedData<T>(
      data,
      total,
      paginationInput.limit
    )

    return paginatedData
  }
}

;(async function () {
  const k = await Paginator.init("mikro-orm", {
    client: "mysql",
    database: "paginator",
    host: "127.0.0.1",
    password: "root",
    port: 3306,
    user: "root",
  })
})()
