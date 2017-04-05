const fs = require('fs');

module.exports = {
  load: async ({configPath}) => {
    try {
      const contents = fs.readFileSync(configPath, 'utf8');
      const json = JSON.parse(contents);
      return json;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {};
      } else {
        throw error;
      }
    }
  },
};
