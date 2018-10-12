const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./api');

const app = express();

if (process.env.NODE_ENV === 'development')
  require('./webpack-dev-middleware').init(app);

if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.join(__dirname, 'dist')));
}

app.use('/public', express.static(path.join(__dirname, 'public')));

/*
let offlineData = JSON.parse(fs.readFileSync(path.resolve('./api_offline.json'), 'utf-8'));
app.get('/offline_api', (req, res) => {
  let data = offlineData.find(item => item.imdbID === req.query.i);
  if (!data) {
    data = { "Response":"False", "Error":`IMDb ID ${req.query.i} not found.` }
  }
  res.json(data);
});
*/

const template = fs.readFileSync(path.resolve('./src/index.html'), 'utf-8');
app.get('/', (req, res) => {
  res.send(template);
});

app.get('/api', (req, res) => {
  api.getData((err, data) => {
    if (err) res.status(500).send(err);
    else res.json(data);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  if (process.env.NODE_ENV === 'development')
    require('open')(`http://localhost:${port}`);
});
