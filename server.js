const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();
    console.log('__dirname:', __dirname);
    console.log('process.cwd():', process.cwd());
    server.use('/.well-known/acme-challenge', express.static('/home/site/wwwroot/.well-known/acme-challenge', {dotfiles: 'allow'}));
    server.use(`/_next`, express.static('/home/site/wwwroot/.next'));
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