import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";

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
    port: 3333,
  })
  .then(() => {
    console.log("http server running");
  });
