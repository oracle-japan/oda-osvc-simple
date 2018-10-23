'use strict';

const express = require('express');
const rightnow = require('./components/rightnow');

const OracleBot = require('@oracle/bots-node-sdk');
const app = express();
OracleBot.init(app, {
  logger: console
});

OracleBot.Middleware.customComponent(app, {
  baseUrl: '/rightnow/gettingstarted/components',
  cwd: __dirname,
  register: [
    './components'
  ]
});

app.get('/', async (req, res) => {
  if (!rightnow.isInitialized()) {
    await rightnow.prepareClient();
  }
  const response1 = await rightnow.startIntaraction();
  const token = response1[0].SessionToken;
  const response2 = await rightnow.getPopularContent(token);
  if (response2[0].ContentListResponse &&
      response2[0].ContentListResponse.SummaryContents &&
      response2[0].ContentListResponse.SummaryContents.SummaryContentList) {
    res.send(JSON.stringify(response2[0].ContentListResponse.SummaryContents.SummaryContentList));
  }
  else {
    res.send(JSON.stringifh(response2));
  }
});

module.exports = app;
