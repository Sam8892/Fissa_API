const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
      status: {
        type: String,
        enum: [
            'accepted',
		       	'viewed',
            'canceled',
            'under review'
        ],
        default: 'under review',
    },
       // from User ID 
             sender: 
             {
                type: mongoose.Types.ObjectId,
                ref: 'user',
               require :true
              },
              // to User Id
              traveler: 
             {
                type: mongoose.Types.ObjectId,
                ref: 'user',
               require :true
              },
              advert: 
              {
                 type: mongoose.Types.ObjectId,
                 ref: 'advertisement',
                 require :true
               }
    },
        
      {
       timestamps: true 
      }
);

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = { Transaction }