const express = require('express');
const transactionController = require('../controllers/transaction.controller');

const router = express.Router();


router.route('/')
      .post(transactionController.create)
      .get(transactionController.getAll)

router.route('/:id')
      .put(transactionController.updateTransaction)
      // .delete(userController.deleteUser)
      .get(transactionController.showTransaction);      
    


module.exports = router;
