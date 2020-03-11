const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.argv.slice(2)[0];

const app = express();
const root = require('./routes/root');

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/', root);

app.listen(PORT, () => {
    console.log('Main Server listening on port: ', PORT);
});