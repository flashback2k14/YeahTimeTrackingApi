// !!!! https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd

// TODO: add components and refs to docs
// https://github.com/davibaltar/swagger-autogen

import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`REST API server ready at: http://localhost:${port}`);
});
