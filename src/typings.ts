import { EntityManager } from "@mikro-orm/core"
import { EntityManager as MysqlEntityManager } from "@mikro-orm/mysql"

export enum PaginationOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface QueryInput {
  limit?: number
  order?: PaginationOrder
  page: number
  sort?: string
  offset?: number
  search?: string
}

export class PaginatedData<T> {
  constructor(data: T[], total: number, limit?: number) {
    this.totalPages = Math.ceil(
      total / (limit ? (limit === 0 ? total : limit) : total)
    )
    this.total = total
    this.data = data
  }

  data: T[]
  total: number
  totalPages: number
}

export interface Paginator<T> {
  paginateMikroOrm(
    manager: EntityManager | MysqlEntityManager,
    entity: T
  ): Promise<PaginatedData<T>>
}
