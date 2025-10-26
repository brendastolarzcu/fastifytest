import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import jwtPlugin from './plugins/jwt';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';

const app = Fastify({ logger: true });

// Register plugins
app.register(cors, { origin: true });
app.register(sensible);
app.register(swagger, {
  openapi: {
    info: {
      title: 'Fastify TS Starter',
      version: '1.0.0',
    },
  },
});
app.register(swaggerUI, { routePrefix: '/docs' });
app.register(jwtPlugin);

// Register routes
app.register(healthRoutes);
app.register(authRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/users' });

const PORT = Number(process.env.PORT || 3000);

app.ready().then(() => {
  app.swagger(); // Generate swagger once plugins are ready
});

app.listen({ port: PORT, host: '0.0.0.0' })
  .then((address) => app.log.info(`Server running at ${address}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
