const express = require('express');
const advertisementController = require('../controllers/advertisement.controller');
const router = express.Router();

router.route('/top')
      .get(advertisementController.showTopFlights);

router.route('/upcoming')
      .get(advertisementController.showUpcomingFlights);

router.route('/flights')
      .post(advertisementController.searchFlights);

router.route('/')
      .post(advertisementController.create)
      .get(advertisementController.getAll);


router.route('/:id')
      .put(advertisementController.updateAds)
      //.delete(userController.deleteUser)
      .get(advertisementController.showAdvert);





module.exports = router;