const batching    = require('./batching.js');

module.exports = function ({ apiKey, maxBatchTime = 60, maxBatchSize = 1000 }) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  batching.init({
    apiKey,
    maxBatchTime,
    maxBatchSize
  });

  return {
    event: function (name, value = 1, dimension = null) {
      if (!name) {
        throw new Error('Missing required parameter: name');
      }
      batching.add(name, value, dimension);
    }
  }
}
