jest.mock("request");

const request = require("request");
const Quickmetrics = require("./index.js");

// Sleep in ms
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

test("batches events", async () => {
  request.mockResolvedValue();

  const qm = new Quickmetrics({ apiKey: "quickmetrics1234", maxBatchSize: 10 });

  // To avoid the test hanging, we make sure to trigger exactly 1 batch of
  // events (based on maxBatchSize)
  qm.event("test:batching", 1);
  qm.event("test:batching", 2);
  qm.event("test:batching", 3);
  qm.event("test:batching", 4, "even");
  qm.event("test:batching", 5, "odd");

  // Sleep to let the batching mechanism flush
  await sleep(0);

  // Batching should not have triggered request yet
  expect(request).toHaveBeenCalledTimes(0);

  qm.event("test:batching", 6, "even");
  qm.event("test:batching", 7, "odd");
  qm.event("batching:test", 1, "int");
  qm.event("batching:test", 1.1, "float");

  // Still no request sent
  await sleep(0);
  expect(request).toHaveBeenCalledTimes(0);

  qm.event("batching:test", 1);

  // Finally, the request should have been triggered
  await sleep(0);
  expect(request).toHaveBeenCalledTimes(1);

  const call = request.mock.calls[0][0];

  expect(JSON.parse(call.body)).toMatchObject([
    {
      name: "test:batching",
      dimension: null,
      values: [
        [expect.any(Number), 1],
        [expect.any(Number), 2],
        [expect.any(Number), 3],
      ],
    },
    {
      name: "test:batching",
      dimension: "even",
      values: [
        [expect.any(Number), 4],
        [expect.any(Number), 6],
      ],
    },
    {
      name: "test:batching",
      dimension: "odd",
      values: [
        [expect.any(Number), 5],
        [expect.any(Number), 7],
      ],
    },
    {
      name: "batching:test",
      dimension: null,
      values: [[expect.any(Number), 1]],
    },
    {
      name: "batching:test",
      dimension: "int",
      values: [[expect.any(Number), 1]],
    },
    {
      name: "batching:test",
      dimension: "float",
      values: [[expect.any(Number), 1.1]],
    },
  ]);
});
