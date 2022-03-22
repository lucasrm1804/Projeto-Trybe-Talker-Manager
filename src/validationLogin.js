const validEmailEmpty = (email) => {
  if (!email || email.length === 0) {
    return 'O campo "email" é obrigatório';
  }
};

const validEmailFormat = (email) => {
  const validation = /.+@.+\..+/;
  if (validation.test(email) === false) {
    return 'O "email" deve ter o formato "email@email.com"';
  }
};

const validPassEmpty = (password) => {
  if (!password || password.length === 0) {
    return 'O campo "password" é obrigatório';
  }
};

const validPassFormat = (password) => {
  const SEIS = 6;
  if (password.length < SEIS) {
    return 'O "password" deve ter pelo menos 6 caracteres';
  }
};

const validationLogin = (email, password) =>
   validEmailEmpty(email)
  || validEmailFormat(email)
  || validPassEmpty(password)
  || validPassFormat(password);

module.exports = validationLogin;
