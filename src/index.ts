import express from 'express';
import { helloWorldLib } from '../lib';

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send(helloWorldLib());
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
