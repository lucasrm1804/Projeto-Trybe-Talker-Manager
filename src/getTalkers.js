const fs = require('fs').promises;

const talkers = async () => {
  try { 
    return JSON.parse(await fs.readFile('./talker.json', 'utf-8'));
  } catch (err) {
    return err;
  }
};

module.exports = talkers;
