const fs = require('fs');
const path = require('path');

module.exports = {
  load: async ({configPath}) => {
    try {
      const contents = fs.readFileSync(path.resolve(process.cwd(), configPath), 'utf8');
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
