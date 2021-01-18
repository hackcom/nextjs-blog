const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();
    console.log('__dirname:', __dirname);
    const staticAcme = path.join(__dirname, '.well-known/acme-challenge');
    const staticNext = path.join(__dirname, '.next');

    console.log('staticAcme:', staticAcme);
    console.log('staticNext:', staticNext);

    server.use('/.well-known/acme-challenge', express.static(staticAcme, {dotfiles: 'allow'}));
    server.use(`/_next`, express.static(staticNext));
    server.get('*', (req, res) => handle(req, res));
    server.listen(port, err => {
      if(err) throw err;
      console.log('Running on port ' + port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  })