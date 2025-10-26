// Augment Fastify instance typings if you add custom decorators/plugins here
import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}
