import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    // payload you sign
    payload: { sub: string; email: string };
    // req.user after verification
    user: { sub: string; email: string };
  }
}