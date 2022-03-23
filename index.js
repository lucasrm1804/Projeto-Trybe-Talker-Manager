const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs/promises');
const getTalkers = require('./src/getTalkers');
const validationLogin = require('./src/validationLogin');
const { validationCad, validToken } = require('./src/validationCad');

const app = express();
app.use(bodyParser.json());
const randomToken = () => crypto.randomBytes(8).toString('hex');

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';
const talkerJson = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  if ((await getTalkers()).length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  } 
  return res.status(HTTP_OK_STATUS).json(await getTalkers());
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = (await getTalkers()).find((talk) => talk.id === parseInt(id, 10));
  if (!talker) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', (req, res) => {
  const token = randomToken();
  const { email, password } = req.body;
  const msg = validationLogin(email, password);
  if (msg) {
    return res.status(400).json({ message: msg });
  } 
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', async (req, res) => {
  const { authorization } = req.headers;
  const { name, age, talk } = req.body;
  const validationReturn = validationCad(authorization, name, age, talk);
  const talkers = JSON.parse(await fs.readFile(talkerJson));
  const id = talkers.length + 1;
  const newTalker = { id, name, age, talk };
  if (validationReturn) {
    return res.status(validationReturn.status).json({ message: validationReturn.msg });
  }
  talkers.push(newTalker); 
  await fs.writeFile(talkerJson, JSON.stringify(talkers));
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const validationReturn = validationCad(authorization, name, age, talk);
  const talkers = JSON.parse(await fs.readFile(talkerJson));
  const newTalker = { id: parseInt(id, 10), name, age, talk };
  if (validationReturn) {
    return res.status(validationReturn.status).json({ message: validationReturn.msg });
  }
  const newTalkers = talkers.filter((talker) => talker.id !== parseInt(id, 10));
  newTalkers.push(newTalker);
  await fs.writeFile(talkerJson, JSON.stringify(newTalkers));
  return res.status(200).json(newTalker);
});

app.delete('/talker/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  const validationReturn = validToken(authorization);
  const talkers = JSON.parse(await fs.readFile(talkerJson));
  if (validationReturn) {
    return res.status(validationReturn.status).json({ message: validationReturn.msg });
  }
  const newTalkers = talkers.filter((talker) => talker.id !== parseInt(id, 10));
  await fs.writeFile(talkerJson, JSON.stringify(newTalkers));
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
