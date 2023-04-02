import express from 'express';
import os from 'os';

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const helloMessage = `Hello from the ${os.hostname()}`;
  console.log(helloMessage);
  res.send(helloMessage);
});

app.listen(PORT, () => {
  console.log(`Web server is listening at port ${port}`);
});

