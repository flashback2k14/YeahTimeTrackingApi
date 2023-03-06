const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const pkg = require('../package.json');

const doc = {
  info: {
    title: 'Yeah! Time tracking API',
    version: pkg.version,
    description: pkg.description,
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    accessHeader: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token',
      description: 'Settings: API access token as header: Get token from `/sign-in` endpoint',
    },
    accessBody: {
      type: 'apiKey',
      in: 'body',
      name: 'token',
      description: 'Settings: API access token as request body: Get token from `/sign-in` endpoint',
    },
    accessQuery: {
      type: 'apiKey',
      in: 'query',
      name: 'token',
      description:
        'Settings: API access token as request URL query param: Get token from `/sign-in` endpoint',
    },
    apiHeader: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-token',
      description: 'API access token as header: Get token from `/authentication` endpoint',
    },
    apiBody: {
      type: 'apiKey',
      in: 'body',
      name: 'apitoken',
      description: 'API access token as request body: Get token from `/authentication` endpoint',
    },
    apiQuery: {
      type: 'apiKey',
      in: 'query',
      name: 'apitoken',
      description:
        'API access token as request URL query param: Get token from `/authentication` endpoint',
    },
  },
};

const outputFile = './public/static/swagger-openapi.json';
const endpointsFiles = [
  './src/index.ts',
  './src/domains/auth/auth.router.ts',
  './src/domains/settings/authentication/authentication.router.ts',
  './src/domains/settings/action-groups/action-group.router.ts',
  './src/domains/settings/actions/action.router.ts',
  './src/domains/tasks/active/active-tasks.router.ts',
  './src/domains/tasks/history/history-tasks.router.ts',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
