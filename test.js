const Quickmetrics = require('./index.js');
const qm = new Quickmetrics({ apiKey: process.env.TOKEN });

// Sleep in ms
const sleep = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const isEven = n => n % 2 === 0;

const test = async (nbEvents) => {
  const range = [...Array(nbEvents).keys()];

  for (const index of range) {
    qm.event('test:batching', 1);
    qm.event('test:batching', 1, isEven(index) ? 'even' : 'odd');
    await sleep(0);
  }
}

test(1000);
