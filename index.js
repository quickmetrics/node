const request  = require('request');
const baseUrl  = 'https://qckm.io/json';

module.exports = function (apiKey) {
  let key = apiKey;

  const callAPI = function(name, value = 1, dimension = null) {
    if (!name) {
      throw new Error('Missing required parameter: name');
    }
    const form = { name, value, dimension };
    const formData = JSON.stringify(form);

    try {
      request({
        headers: {
          'X-QM-KEY': key
        },
        uri: baseUrl,
        body: formData,
        method: 'POST'
      });
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  return {
    setKey: function (apiKey) {
      if (!apiKey) {
        throw new Error('API key is required');
      }

      key = apiKey;
    },

    event: function (name, value, dimension) {
      callAPI(name, value, dimension);
    }
  }
}
