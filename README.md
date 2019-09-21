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
Import the module and and create an instance of Quickmetrics:

```
  import Quickmetrics from 'quickmetrics';
  const qm  = new Quickmetrics('YOUR API KEY');
```

Note: You can get the quickmetrics.io API key in your dashboard: https://app.quickmetrics.io/docs/getting-started/authentication

### Send events
Sending events is very straightforward:

`qm.event('your.event', 123.456);`

And that's it!

For more info on naming conventions and examples check out our docs at https://app.quickmetrics.io/docs
