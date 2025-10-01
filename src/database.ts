import setupKnex, { Knex } from "knex";
import { env } from "./env";

export const databaseConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(databaseConfig);
