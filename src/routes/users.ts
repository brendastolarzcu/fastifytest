// Import the FastifyInstance type from the fastify library to type the app parameter
import { FastifyInstance } from 'fastify';
// Import the Type utility from TypeBox for creating JSON schemas
import { Type } from '@sinclair/typebox';
// Import the TypeBox type provider for enhanced TypeScript support with Fastify
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

// Export an async function that registers user-related routes on the Fastify app instance
export async function userRoutes(app: FastifyInstance) {
  // Create a typed version of the app instance with TypeBox type provider for better type safety
  const s = app.withTypeProvider<TypeBoxTypeProvider>();

  // Bearer token authentication function
  const authenticateBearer = async (request: any, reply: any) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ message: 'Missing or invalid Bearer token' });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Validate Bearer token format (starts with 'bearer_' and is base64)
      if (!token.startsWith('bearer_')) {
        return reply.code(401).send({ message: 'Invalid Bearer token format' });
      }

      // Decode the token to extract email (for demo purposes)
      const encodedPart = token.substring(7); // Remove 'bearer_' prefix
      const decoded = Buffer.from(encodedPart, 'base64').toString('utf-8');
      const [email] = decoded.split(':');
      
      // Store user info in request for use in route handler
      request.bearerUser = { email };
    } catch (err) {
      return reply.code(401).send({ message: 'Invalid Bearer token' });
    }
  };

  // Define the response schema for the /me endpoint using TypeBox
  const MeResponse = Type.Object({
    // The user ID will be a string
    id: Type.String(),
    // The email must be a valid email format string
    email: Type.String({ format: 'email' }),
    // The user role will be a string
    role: Type.String(),
  });

  // Define the response schema for the /me-bearer endpoint using TypeBox
  const BearerMeResponse = Type.Object({
    // The email must be a valid email format string
    email: Type.String({ format: 'email' }),
  });

  // Register a GET route at the '/me' endpoint with authentication and schema validation
  s.get('/me', {
    // Add pre-validation hook that requires authentication before the route handler runs
    preValidation: [app.authenticate],
    // Define the OpenAPI/JSON schema for this endpoint
    schema: {
      // Add a summary description for the endpoint in API documentation
      summary: 'Get current user (requires JWT token)',
      // Tag this endpoint under 'users' for API documentation grouping
      tags: ['users'],
      // Define response schemas for successful (200) and unauthorized (401) responses
      response: { 200: MeResponse, 401: Type.Object({ message: Type.String() }) },
    },
  }, async (req) => {
    // Extract the authenticated user from the request object (added by JWT middleware)
    const user = (req as any).user as { sub: string; email: string };
    // Return the user information with a default role of 'user'
    return { id: user.sub, email: user.email, role: 'user' };
  });

  // Register a GET route at the '/me-bearer' endpoint with Bearer token authentication
  s.get('/me-bearer', {
    // Add pre-validation hook that requires Bearer token authentication
    preValidation: [authenticateBearer],
    // Define the OpenAPI/JSON schema for this endpoint
    schema: {
      // Add a summary description for the endpoint in API documentation
      summary: 'Get current user email (requires Bearer token)',
      // Tag this endpoint under 'users' for API documentation grouping
      tags: ['users'],
      // Define response schemas for successful (200) and unauthorized (401) responses
      response: { 200: BearerMeResponse, 401: Type.Object({ message: Type.String() }) },
    },
  }, async (req) => {
    // Extract the authenticated user from the request object (added by Bearer token middleware)
    const user = (req as any).bearerUser as { email: string };
    // Return only the user email
    return { email: user.email };
  });
}
