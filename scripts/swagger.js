const swaggerJsdoc = require('swagger-jsdoc');
const { promises: fs } = require('node:fs');
const pkg = require('../package.json');

async function init() {
  const endpointsFiles = [
    './src/domains/auth/auth.router.ts',
    './src/domains/settings/action-groups/action-group.router.ts',
    './src/domains/settings/actions/action.router.ts',
    // './src/domains/settings/authentication/authentication.router.ts',
    // './src/domains/tasks/active/active-tasks.router.ts',
    // './src/domains/tasks/history/history-tasks.router.ts',
  ];

  const options = {
    failOnErrors: true,
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Yeah! Time tracking API',
        version: pkg.version,
        description: pkg.description,
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      servers: [
        { url: 'http://localhost:3000' },
        { url: 'https://localhost:3000' },
        { url: 'https://ytt-api.flbk.tech' },
      ],
      components: {
        securitySchemes: {
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
            description:
              'Settings: API access token as request body: Get token from `/sign-in` endpoint',
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
            description:
              'API access token as request body: Get token from `/authentication` endpoint',
          },
          apiQuery: {
            type: 'apiKey',
            in: 'query',
            name: 'apitoken',
            description:
              'API access token as request URL query param: Get token from `/authentication` endpoint',
          },
        },
        schemas: {
          ApiErrorResponse: {
            type: 'object',
          },
          Id: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'd741861a-3967-4503-90f2-afc8ee45fef8',
              },
            },
          },
          UserId: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                format: 'uuid',
                example: 'd741861a-3967-4503-90f2-afc8ee45fef8',
              },
            },
          },
          Dates: {
            type: 'object',
            properties: {
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-03-06T09:13:23.522Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-03-06T09:13:23.522Z',
              },
            },
          },
          AuthRequest: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address.',
                example: 'john@doe.test',
              },
              password: {
                type: 'string',
                format: 'password',
                description: 'User password.',
                example: '123456',
              },
            },
          },
          AuthResponse: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'User auth token.',
                example: 'dfdg.wertdf.wewetsfdfg',
              },
              user: {
                $ref: '#/components/schemas/AuthUser',
              },
            },
          },
          AuthUser: {
            allOf: [
              { $ref: '#/components/schemas/Id' },
              { $ref: '#/components/schemas/Dates' },
              {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'john',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@doe.test',
                  },
                },
              },
            ],
          },
          ActionGroupRequest: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'action group name.',
                example: 'action group #1',
              },
            },
          },
          ActionGroupsResponse: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ActionGroup',
            },
          },
          ActionGroupResponse: {
            $ref: '#/components/schemas/ActionGroup',
          },
          ActionGroup: {
            allOf: [
              { $ref: '#/components/schemas/Id' },
              { $ref: '#/components/schemas/UserId' },
              { $ref: '#/components/schemas/Dates' },
              {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'action group #1',
                  },
                },
              },
            ],
          },
          ActionRequest: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'action #1',
              },
              type: {
                type: 'string',
                example: 'type #1',
              },
            },
          },
          ActionsResponse: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Action',
            },
          },
          ActionResponse: {
            $ref: '#/components/schemas/Action',
          },
          Action: {
            allOf: [
              { $ref: '#/components/schemas/Id' },
              { $ref: '#/components/schemas/UserId' },
              { $ref: '#/components/schemas/Dates' },
              {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'action #1',
                  },
                  type: {
                    type: 'string',
                    example: 'type #1',
                  },
                  actionGroupId: {
                    type: 'string',
                    format: 'uuid',
                    example: 'd741861a-3967-4503-90f2-afc8ee45fef8',
                  },
                },
              },
            ],
          },
        },
      },
    },
    apis: endpointsFiles,
  };

  const outputFile = './public/static/swagger-openapi.json';
  const openapiSpecification = swaggerJsdoc(options);

  await fs.writeFile(outputFile, JSON.stringify(openapiSpecification, null, 2));
}

init().catch((err) => console.error(err));
