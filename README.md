# node
The official Nodejs client for Quickmetrics

### Installation
```
  npm install --save quickmetrics
  yarn add quickmetrics
```

### Documentation
You can find an online documentation at https://app.quickmetrics.io/docs

### How to use it
Import the module and and initialize an instance of Quickmetrics:

```
  import Quickmetrics from 'quickmetrics';
  const qm  = new Quickmetrics({
    apiKey: 'XXX-YYY',
    maxBatchTime: 60, // max and default set to 60 seconds
    maxBatchSize: 1000 // max and default set to 1000 events per batch
  });
```

Note: You can get the quickmetrics.io API key in your dashboard: https://app.quickmetrics.io/docs/getting-started/authentication

### Send events
Sending events is easy:

`qm.event('your.event', 123.456, 'secondary dimension');`

And that's it!

For more info on naming conventions and examples check out our docs at https://app.quickmetrics.io/docs
