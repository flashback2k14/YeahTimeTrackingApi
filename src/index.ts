// TODO: add components and refs to docs
//  https://github.com/davibaltar/swagger-autogen
// TODO: add cors and helmet

import app from './app/app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`REST API server ready at: http://localhost:${port}`);
});
