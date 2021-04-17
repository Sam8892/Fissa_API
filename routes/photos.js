const express = require('express');
const photoController = require('../controllers/photo.controller');
const router = express.Router();

router.route('/photos')
      .get(photoController.getPhoto);


module.exports = router;