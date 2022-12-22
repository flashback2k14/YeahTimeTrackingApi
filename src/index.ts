// https://www.digitalocean.com/community/tutorials/how-to-build-a-rest-api-with-prisma-and-postgresql
// https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-express
// https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-one-relations

import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => console.log('REST API server ready at: http://localhost:3000'));
