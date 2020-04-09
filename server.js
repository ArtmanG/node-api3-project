const express = require('express');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());
server.use('/api/users', userRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware
function logger(req, res, next) {
  const method = req.method;
  const originalURL = req.originalURL;

  console.log(`${method}, ${originalURL}`);
  next();
}

module.exports = server;
