import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EnglishMaster API',
      version: '1.0.0',
      description: 'API documentation for the EnglishMaster platform',
    },
    servers: [
      {
        url: 'http://localhost:4001/api',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
