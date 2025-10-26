// Import the FastifyInstance type from the fastify library to type the app parameter
import { FastifyInstance } from 'fastify';

// Export an async function that registers health check routes on the Fastify app instance
export async function healthRoutes(app: FastifyInstance) {
  // Register a GET route at the '/health' endpoint with schema validation and handler
  app.get('/health', {
    // Define the OpenAPI/JSON schema for this endpoint
    schema: {
      // Add a description for the endpoint in the API documentation
      description: 'Liveness probe',
      // Define the response schema for successful requests (HTTP 200)
      response: {
        // Specify the schema for HTTP 200 responses
        200: {
          // The response will be a JSON object
          type: 'object',
          // Define the properties of the response object
          properties: { ok33: { type: 'boolean' } },
        },
      },
    },
  }, async () => ({ ok33: true })); // Async handler function that returns a simple object with ok33 set to true
}
