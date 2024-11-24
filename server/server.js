import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    fastify.log.error(`Server execution failed: ${err}`);
    process.exit(1);
  }
});