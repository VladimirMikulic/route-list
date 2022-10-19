const express = require('express');

const app = express();

app.get('/admin', (req, res) => res.sendStatus(200));
app.get('/admin/members', (req, res) => res.sendStatus(200));
app.get('/admin/settings', (req, res) => res.sendStatus(200));

app.get('/users', (req, res) => res.sendStatus(200));
app.post('/users', (req, res) => res.sendStatus(200));

app.get('/users/:id', (req, res) => res.sendStatus(200));
app.patch('/users/:id', (req, res) => res.sendStatus(200));

app.get('/products', (req, res) => res.sendStatus(200));
app.post('/products', (req, res) => res.sendStatus(200));

app.get('/products/:id', (req, res) => res.sendStatus(200));
app.patch('/products/:id', (req, res) => res.sendStatus(200));
app.delete('/products/:id', (req, res) => res.sendStatus(200));

app.get('/blog', (req, res) => res.sendStatus(200));
app.post('/blog', (req, res) => res.sendStatus(200));
app.get('/blog/:id', (req, res) => res.sendStatus(200));
app.patch('/blog/:id', (req, res) => res.sendStatus(200));
app.delete('/blog/:id', (req, res) => res.sendStatus(200));

app.listen(3000);

module.exports = app;
