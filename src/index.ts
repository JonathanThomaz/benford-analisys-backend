import express, { Request } from 'express';
import uploadFile from './services/uploadFile';
import bodyParser from 'body-parser';
import { getBenfordFirstDigitExpected } from 'benford-analysis';
import { getDefaultDeviation, getDeviationByFirstDigit, readCsv, separateNumberByFirstDigit } from 'benford-analysis';

interface MulterRequest extends Request {
  file: any;
}

const app = express();

const port = 3333;

app.use(bodyParser.json({ limit: '50mb' }));

app.get('/benford-law', (req, res) => {
  res.status(200).send(getBenfordFirstDigitExpected());
});

app.post('/separate', (req, res) => {
  const { array } = req.body;
  if (array) {
    const arrayNumber = array.filter((item: number | string) => Number(item));
    res.status(200).send(separateNumberByFirstDigit(arrayNumber));
  }
  res.status(400).send('Please send an array');
});
app.post('/benford-law', (req, res) => {
  const { d1, d2, d3, d4, d5, d6, d7, d8, d9 } = req.body;
  const array = [d1, d2, d3, d4, d5, d6, d7, d8, d9];
  const list = array.map((item, index) => getDeviationByFirstDigit(index + 1, item.percent));
  const defaultDeviation = getDefaultDeviation(list.map((item) => item.deviation));
  res.send({ list, defaultDeviation });
});

app.post('/read-csv', async (req, res) => {
  try {
    await uploadFile(req, res);
    if ((req as MulterRequest).file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    const array = readCsv((req as MulterRequest).file.path);

    res.status(200).send({
      message: 'Uploaded the file successfully: ' + (req as MulterRequest).file.originalname,
      contentFile: array,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${(req as MulterRequest).file?.originalname}. ${err}`,
    });
  }
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
