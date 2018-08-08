const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const api = require('./routes/api');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  next();
});

app.use(bodyParser.json({ limit: '1mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({
  limit: '1mb',
  extended: true,
})); // support encoded bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(compression({
  level: 9,
  threshold: 0,
}));

app.use('/api', api);
app.use('/public', express.static(path.join(__dirname, 'public')));

const server = require('http')
               .createServer(app)
               .listen(config.port, config.isDev ? 'localhost' : config.ip);

console.log(`Simple Agama build server is running at ${config.isDev ? 'localhost' : config.ip}:${config.port}`);