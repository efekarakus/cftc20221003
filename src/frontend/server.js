'use strict';

const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

// App.
const app = express();
app.get('/', (req, res) => {
    res.json({
        'vars': process.env
    });
});

app.get('/fail', (req, res) => {
    console.log('Received request to terminate, shutting down');
    process.exit(1);
});

app.get('/_healthcheck', (req, res) => {
    console.log('Health check OK');
    res.sendStatus(200);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});