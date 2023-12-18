const express = require('express');

const UserController = require('./controllers/UserController');

const authMiddleware = require('./middlewares/auth');

const router = express.Router();

router.post('/users/login', UserController.login);

router.post('/users', UserController.store);

router.get('/users', UserController.index);
router.use(authMiddleware);



router.put('/users/:user_id', UserController.update);

router.delete('/users/:user_id', UserController.delete);


module.exports = router;