import setupKnex, { Knex } from "knex";

export const databaseConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(databaseConfig);
