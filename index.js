const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const { APP_CONSTANTS } = require('./constants/constants');
const { defaulPort, routes } = require('./config/config');
const { mongooseConfig } = require('./config/db');
const { router } = require('./routes/routes');
const { sourceModifier } = require('./services/sourceModifier');

dotenv.config();

const PORT_NUMBER = process.env.PORT_NUMBER ?? defaulPort;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes.user, sourceModifier, router);

mongoose.connect(process.env.CONNECTION_URL, mongooseConfig)
    .then(() => {
        console.log(APP_CONSTANTS.DB_CONNECTED);
        app.listen(PORT_NUMBER, () => {
            console.log(APP_CONSTANTS.SERVER_UP, PORT_NUMBER);
        });
    }).catch((err) => {
        // fatal: log the error
        console.log(APP_CONSTANTS.DB_ERROR);
    });
