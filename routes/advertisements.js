const express = require('express');
const advertisementController = require('../controllers/advertisement.controller');
const router = express.Router();


router.route('/')
      .post(advertisementController.create)
      .get(advertisementController.getAll)

router.route('/:id')
      .put(advertisementController.updateAds)
      // .delete(userController.deleteUser)
      // .get(userController.showUSer);      
    


module.exports = router;