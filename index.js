const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const talkers = require('./src/getTalkers');
const validationLogin = require('./src/validationLogin');

const app = express();
app.use(bodyParser.json());
const token = () => crypto.randomBytes(8).toString('hex');

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  if ((await talkers()).length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  } 
  return res.status(HTTP_OK_STATUS).json(await talkers());
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = (await talkers()).find((talk) => talk.id === parseInt(id, 10));
  if (!talker) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', (req, res) => {
  const toke = token();
  const { email, password } = req.body;
  const msg = validationLogin(email, password);
  if (msg) {
    return res.status(400).json({ message: msg });
  } 
  return res.status(200).json({ token: toke });
});

app.listen(PORT, () => {
  console.log('Online');
});
