import { MikroORMOptions } from "@mikro-orm/core"

export default {
  user: "root",
  password: "root",
  dbName: "paginator-mikro",
  entities: ["./src/*.mikro.ts"],
  entitiesTs: ["./src/*.mikro.ts"],
  type: "mysql",
} as MikroORMOptions
