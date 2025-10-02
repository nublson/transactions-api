import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  //* Get Transactions
  app.get("/", async () => {
    const transactions = await knex("transactions").select();

    return {
      transactions,
    };
  });

  //* Get Transaction by id
  app.get("/:id", async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getTransactionsParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where("id", id).first();

    return {
      transaction,
    };
  });

  //* Get summary
  app.get("/summary", async () => {
    const summary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return {
      summary,
    };
  });

  //* Create Transactions
  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
