const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const PORT = process.env.SERVER_PORT;
const app = express();
const root = require('./routes/root');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());

app.use('/', root);

app.listen(PORT, () => {
    console.log('Main Server listening on port: ', PORT);
});