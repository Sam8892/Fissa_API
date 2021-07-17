const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/');
    },
    filename: (req, file, cb) => {
        const newFileName = new Date().getTime().toString() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})


const upload = multer({ storage });
router.route('/login')
    .post(userController.login)



router.route('/')
    .get(userController.getAll)
    .post(upload.single('avatar'), userController.create)



router.route('/:id')
    .patch(upload.single('avatar'), userController.updateUser)
    .delete(userController.deleteUser)
    .get(userController.showUSer);
router.route('/comments/:id')   
    .get(userController.showMyComments)
router.route('/flights/:id')
    .get(userController.showMyFlights);

module.exports = router;