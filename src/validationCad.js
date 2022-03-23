const validTokenEmpty = (token) => {
  if (!token) {
    return { status: 401, msg: 'Token não encontrado' };
  }
};

const validTokenFormat = (token) => {
  if (token.length < 16) {
    return { status: 401, msg: 'Token inválido' };
  }
};

const validToken = (token) => 
  validTokenEmpty(token)
  || validTokenFormat(token);

const validNameEmpty = (name) => {
  if (!name) {
    return { status: 400, msg: 'O campo "name" é obrigatório' };
  }
};

const validNameFormat = (name) => {
  if (name.length < 3) {
    return { status: 400, msg: 'O "name" deve ter pelo menos 3 caracteres' };
  }
};

const validName = (name) =>
  validNameEmpty(name)
  || validNameFormat(name);

const validAgeEmpty = (age) => {
  if (!age) {
    return { status: 400, msg: 'O campo "age" é obrigatório' };
  }
};

const validAgeFormat = (age) => {
  if (age < 18 || !Number.isInteger(age)) {
    return { status: 400, msg: 'A pessoa palestrante deve ser maior de idade' };
  }
};

const validAge = (age) =>
  validAgeEmpty(age)
  || validAgeFormat(age);

const validDate = (watchedAt) => {
  const vali = /^(((?=3)3[0-1])|(?=[0-2])[0-2][1-9])\/(((?=1)1[0-2])|0[1-9])\/\d{4}/;
  if (vali.test(watchedAt) === false) {
    return { status: 400, msg: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };
  }
};

const validRate = (rate) => {
  if (!Number.isInteger(rate) || rate > 5 || rate < 1) {
    return { status: 400, msg: 'O campo "rate" deve ser um inteiro de 1 à 5' };
  }
};

const validTalker = (talk) => {
  if (!talk || talk.length === 0 || !talk.watchedAt || !talk.rate) {
    return {
      status: 400,
      msg: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
     };
  }
};

const validTalk = (talk = {}) => {
  const { watchedAt, rate } = talk;
  return validTalker(talk)
  || validDate(watchedAt)
  || validRate(rate); 
};

const validationCad = (token, name, age, talk) => 
  validToken(token)
  || validName(name)
  || validAge(age)
  || validTalk(talk);

module.exports = validationCad;