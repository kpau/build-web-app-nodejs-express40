const axios = require('axios');
const xml2json = require('xml2js');
const debug = require('debug')('app:goodreadsService');

function goodreadsService() {
  const parser = xml2json.Parser({ explicitArray: false });

  async function getBookById(id) {
    return new Promise(async (res, rej) => {
      try {
        const response = await axios.get(`http://goodreads/api/etc.${id}.xml?key=key`);
        parser.parseString(response.data, (err, result) => {
          if (err) {
            debug(err);
            rej(err);
          } else {
            debug(result);
            res(result.GoodreadsResponse.book);
          }
        });
      } catch (error) {
        debug(error);
        rej(error);
      }
    });
  }

  return { getBookById };
}

module.exports = goodreadsService();
