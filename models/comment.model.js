const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
      
       // from User ID 
             sender: 
             {
                type: mongoose.Types.ObjectId,
                ref: 'user',
               require :true
              },
              // to User Id
              receiver: 
             {
                type: mongoose.Types.ObjectId,
                ref: 'user',
               require :true
              },
            content: {
                type: String,
            },
            rate : {
              type : Number
            }
    },
        
      {
       timestamps: true 
      }
);

const Comment = mongoose.model('comment', commentSchema);

module.exports = { Comment }