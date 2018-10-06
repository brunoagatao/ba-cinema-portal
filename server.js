const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./api');

const app = express();

if (!process.env.OMDB_API_KEY) {
  require('dotenv').config({ silent: true });
  if (process.env.NODE_ENV === 'development') {
    require('./webpack-dev-middleware').init(app);
  }
}

app.use('/public', express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.join(__dirname, 'dist')));
}

/*
let offlineData = JSON.parse(fs.readFileSync(path.resolve('./api_offline.json'), 'utf-8'));
app.get('/offline_api', function(req, res) {
  let data = offlineData.find(item => item.imdbID === req.query.i);
  if (!data) {
    data = { "Response":"False", "Error":`IMDb ID ${req.query.i} not found.` }
  }
  res.json(data);
});
*/

const template = fs.readFileSync(path.resolve('./src/index.html'), 'utf-8');
app.get('/', function (req, res) {
  res.send(template);
});

app.get('/api', function (req, res) {
  api.getData(function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
});

const port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
  if (process.env.NODE_ENV === 'development') {
    require('open')(`http://localhost:${port}`);
  }
});