/**
 * Swagger/OpenAPI Documentation Configuration
 * Auto-generates API documentation for all endpoints
 */

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EcobServe API Documentation',
    version: '1.0.0',
    description: `
# EcobServe REST API

Complete API documentation for the EcobServe platform - Event Sustainability Tracking & Analytics.

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`

Obtain tokens via the \`/api/auth/login\` endpoint.

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour
- All other endpoints: 100 requests per 15 minutes

## Response Format

All responses follow this structure:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
\`\`\`

Error responses:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
\`\`\`

## Subscription Tiers

- **Explorer**: Free tier (1 event/month)
- **Planner**: R499/month (6 events/year + AI features)
- **Impact Leader**: R1,999/month (unlimited events + analytics)
- **Enterprise**: Custom pricing (API access + custom features)
    `,
    contact: {
      name: 'EcobServe Support',
      email: 'support@ecobserve.com',
      url: 'https://ecobserve.com',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    {
      url: 'https://ecobserve.aidocumines.com/api',
      description: 'Production Server',
    },
    {
      url: 'http://localhost:8035/api',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /api/auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Error message',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          fullName: {
            type: 'string',
          },
          role: {
            type: 'string',
            enum: ['admin', 'owner', 'member', 'viewer'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Event: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          eventType: {
            type: 'string',
          },
          attendees: {
            type: 'integer',
          },
          location: {
            type: 'string',
          },
          startDate: {
            type: 'string',
            format: 'date',
          },
          endDate: {
            type: 'string',
            format: 'date',
          },
          status: {
            type: 'string',
            enum: ['draft', 'planned', 'completed'],
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication & authorization' },
    { name: 'Events', description: 'Event management & carbon footprint calculations' },
    { name: 'Payments', description: 'Subscription plans & payment processing' },
    { name: 'Enterprise', description: 'Enterprise features (onboarding, feature requests, bug reports)' },
    { name: 'Planner', description: 'Planner tier features (AI recommendations, certificates, offsets)' },
    { name: 'Impact Leader', description: 'Impact Leader tier features (dashboards, research, analytics)' },
    { name: 'Analytics', description: 'Usage analytics & tracking' },
    { name: 'Statistics', description: 'Platform-wide statistics' },
  ],
};

