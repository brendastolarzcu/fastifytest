import { FastifyInstance } from 'fastify';
import { Type, Static } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export async function authRoutes(app: FastifyInstance) {
  const s = app.withTypeProvider<TypeBoxTypeProvider>();

  const LoginBody = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 6 }),
  });

  const LoginResponse = Type.Object({
    accessToken: Type.String(),
  });

  const BearerLoginResponse = Type.Object({
    accessToken: Type.String(),
    tokenType: Type.String(),
  });

  s.post('/login', {
    schema: {
      summary: 'Login and receive JWT',
      tags: ['auth'],
      body: LoginBody,
      response: { 200: LoginResponse, 401: Type.Object({ message: Type.String() }) },
    },
  }, async (req, reply) => {
    const { email, password } = req.body as Static<typeof LoginBody>;

    // TODO: replace with real user lookup/verification
    if (email && password) {
      const token = app.jwt.sign({ sub: 'user_123', email }, { expiresIn: '1h' });
      return { accessToken: token };
    }

    return reply.code(401).send({ message: 'Invalid credentials' });
  });

  s.post('/login-bearer', {
    schema: {
      summary: 'Login and receive Bearer token',
      tags: ['auth'],
      body: LoginBody,
      response: { 200: BearerLoginResponse, 401: Type.Object({ message: Type.String() }) },
    },
  }, async (req, reply) => {
    const { email, password } = req.body as Static<typeof LoginBody>;

    // TODO: replace with real user lookup/verification
    if (email && password) {
      // Generate a simple Bearer token (in production, use a secure random token)
      const token = `bearer_${Buffer.from(`${email}:${Date.now()}`).toString('base64')}`;
      return { 
        accessToken: token,
        tokenType: 'Bearer'
      };
    }

    return reply.code(401).send({ message: 'Invalid credentials' });
  });
}
