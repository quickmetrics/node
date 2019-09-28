const { Batcher } = require('bottleneck/es5');
const request     = require('request');
const baseUrl     = 'https://qckm.io/list';

const cleanSettings = ({ maxBatchTime, maxBatchSize }) => {
  if (maxBatchSize < 10) {
		maxBatchSize = 10;
	} else if (maxBatchSize > 1000) {
		maxBatchSize = 1000;
	}

	if (maxBatchTime < 1) {
		maxBatchTime = 1;
	} else if (maxBatchTime > 60) {
		maxBatchTime = 60;
	}
	maxBatchTime = maxBatchTime * 1000;

  return { maxBatchTime, maxBatchSize };
}

const callAPI = (events, key) => {
  const formData = JSON.stringify(events);
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
    throw new Error(err);
  }
}

const compileEvents = (batch) => {
  const holder = {};

  batch.forEach(e => {
    if (!holder[e.name]) {
			holder[e.name] = {
        values: [],
        dimensions: {}
      };
    }

    if (e.dimension === null) {
      holder[e.name].values.push([e.time, e.value]);
    } else {
      if (!holder[e.name].dimensions[e.dimension]) {
        holder[e.name].dimensions[e.dimension] = [];
      }
      holder[e.name].dimensions[e.dimension].push([e.time, e.value]);
    }
  });

  const output = [];

  for (const name of Object.keys(holder)) {
    if (!!holder[name].values && holder[name].values.length) {
      output.push({
        name,
        dimension: null,
        values: holder[name].values
      });
    }

    const dimensions = Object.keys(holder[name].dimensions);
    for (const dimension of dimensions) {
      const values = holder[name].dimensions[dimension];

      output.push({
        name,
        dimension,
        values
      });
    }
  }

  return output;
}

const batching = {
  isInit: false,
  batcher: null,
  multipleStatements: true,
  key: null,

  init: function({ apiKey, maxBatchTime, maxBatchSize }) {
    if (this.isInit) {
      return;
    }

    this.key = apiKey;
    const batchSettings = cleanSettings({ maxBatchTime, maxBatchSize });

    this.isInit = true;
    this.batcher = new Batcher({
      maxTime: batchSettings.maxBatchTime,
      maxSize: batchSettings.maxBatchSize
    });

    this.batcher.on('batch', (batch) => {
      const events = compileEvents(batch);
      callAPI(events, this.key);
    });
  },

  add: function(name, value, dimension) {
    const date = new Date(); 
    const now_utc =  Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );

    const nowUTC = new Date(now_utc).getTime() / 1000;
    this.batcher.add({ name, time: nowUTC, value, dimension });
  }
}

module.exports = batching;
