const express = require('express');
const app =express();

const OracleBot = require('@oracle/bots-node-sdk');
OracleBot.init(app);
OracleBot.Middleware.customComponent(app, {
  baseUrl: '/faqbotsample/components',
  cwd: __dirname,
  register: [
    './components'
  ]
});

module.exports = app;
