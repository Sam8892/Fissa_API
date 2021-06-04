const express = require('express');
const commentController = require('../controllers/comment.controller');

const router = express.Router();


router.route('/')
      .post(commentController.create)
  //    .get(transactionController.getAll)

 /* router.route('/:id')
      .put(transactionController.updateTransaction)
      // .delete(userController.deleteUser)
      .get(transactionController.showTransaction);     */ 
    


module.exports = router;