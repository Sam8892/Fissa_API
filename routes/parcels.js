const express = require('express');
const router = express.Router();

const parcelController = require('../controllers/parcel.controller');
const multer= require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './public/images/');
    },
    filename: (req,file,cb)=>{
        const newFileName = new Date().getTime().toString() + path.extname(file.originalname);
        cb(null,newFileName);
    }
})

const upload = multer({ storage });

router.route('/')
    .get(parcelController.getAll)
    .post(upload.single('photo'), parcelController.create)
    //hello
    

router.route('/:id')
   .put(upload.single('photo'),parcelController.updateParcel)
  //  .delete(userController.deleteUser)
    .get(parcelController.showParcel);

module.exports = router;