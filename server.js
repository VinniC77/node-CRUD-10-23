// import { createServer } from "node:http";

// const server = createServer((req, res) => {
//   res.write("Hello World");
//   return res.end();
// });

// server.listen(3333);

// Agora o mesmo código que o de cima, mas escrito com o Fastify

import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();
// const database = new DatabaseMemory();

const database = new DatabasePostgres();

// Request Body - Através do PUT ou POST, podemos enviar um "corpo" (dados) para a requisição

server.post("/videos", async (req, res) => {
  const { title, description, duration } = req.body;

  await database.create({
    title,
    description,
    duration,
  });

  console.log(database.list());

  return res.status(201).send();
});

server.get("/videos", async (req, res) => {
  const search = req.query.search;

  const videos = await database.list();

  return videos;
});

server.put("/videos/:id", async (req, res) => {
  const videoID = req.params.id;
  const { title, description, duration } = req.body;

  await database.update({
    title,
    description,
    duration,
  });

  return res.status(204).send();
});

server.delete("/videos/:id", async (req, res) => {
  const videoId = req.params.id;
  await database.delete(videoId);

  return res.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
});

// API que gerencia videos
