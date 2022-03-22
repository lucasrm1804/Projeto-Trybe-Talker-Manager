const fs = require('fs').promises;

const talkers = async () => {
  try { 
    return JSON.parse(await fs.readFile('./talker.json'));
  } catch (err) {
    return err;
  }
};

module.exports = talkers;
