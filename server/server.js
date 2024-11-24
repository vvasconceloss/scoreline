import Fastify from "fastify";
import { config } from "dotenv";
import cors from "@fastify/cors";
import { footballRoutes } from "./routes/footballApiRoutes.js";

config();

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['GET']
});

fastify.register(footballRoutes, { prefix: 'football' });

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    fastify.log.error(`Server execution failed: ${err}`);
    process.exit(1);
  }
});