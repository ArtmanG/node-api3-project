const express = require('express');
const database = require('./userDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  database.insert(req.body)
  .then(() => {
    res.status(201).json(req.body);
  })
  .catch(error => {
    console.log(error.message, error);
    res.status(500).json({message: 'Internal Server Error'})
  })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  const posts = req.body;
  const { text, user_id } = req.body;
  database.insert(posts)
    .then((post) => {
      if (!text) {
        res.status(400).json({ message: 'Missing Required Text' });
      } else if (!user_id) {
        res.status(400).json({ message: 'User ID not given' });
      } else if (post) {
        res.status(201).json(post);
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })
    .catch((error) => {
      console.log(error.message, error);
    });
});

router.get('/', (req, res) => {
  database.get(req.query)
  .then((users) => {
    res.status(200).json(users);
  })
  .catch(error => {
    console.log(error.message, error);
    res.status(500).json({message: 'Internal Server Error'})
  })
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {
  database.getUserPosts(req.params.id)
  .then(posts => {
    if (posts) {
      res.status(200);
    } else {
      res.status(404).json({message: 'Post Not Found'})
    }
  })
  .catch(error => {
    console.log(error.message, error);
    res.status(500).json({message: 'Internal Server Error'})
  })
});

router.delete('/:id', (req, res) => {
  database.remove(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    console.log(error.message, error);
    res.status(500).json({message: 'error'})
  })
});

router.put('/:id', (req, res) => {
  database.update(req.params.id, req.body)
  .then(
    res.status(200).json(req.body))
  .catch(error => {
    console.log(error.message, error);
    res.status(500).json({message: 'Internal Server Error'})
  })
});



//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  database.getById(id)
  .then(user => {
    if (user) {
      req.user = user
      next();
    } else {
      res.status(404).json({message: `User With ID: ${id} Not Found`})
    }
  })
  .catch(err => {
    console.log(err, err.message);
    res.status(500).json({message: 'Internal Server Error'})
  })
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!req.body) {
    res.status(400).res.json({ message: "Missing User Data" });
  } else if (!name) {
    res.status(400).json({ message: "Missing User Name" });
  } else {
    res.status(201).json(req.body);
    next();
  }
}

function validatePost(req, res, next) {
  const { body } = req;
  const { text } = req.body;
  if (!body) {
    res.status(400).json({ message: "Missing Post Data" });
  } else if (!text) {
    res.status(400).json({ message: "Missing Required Text" });
  } else {
    res.status(201).json(body);
  }
}

module.exports = router;
