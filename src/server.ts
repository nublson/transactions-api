import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
  await knex("transactions")
    .insert({
      id: crypto.randomUUID(),
      title: "Testing transaction",
      amount: 4000,
    })
    .returning("*");

  const transactions = await knex("transactions").select("*");

  return transactions;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("http server running");
  });
