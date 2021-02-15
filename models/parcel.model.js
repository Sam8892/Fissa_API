const mongoose = require('mongoose');


const parcelSchema = mongoose.Schema(
    {
      dimension: {
        type: String,
        enum: [
            'small',
			      'meduim',
            'large',
            'very large',
       
        ],
        default: 'meduim',
    },
    weight: {
      
        type: Number, 
      },
      parcelType: {
        type: String,
        enum: [
            'clothing',
			      'electronic',
            'books',
            'documents',
            'keys',
            'other...'
            
        ],
        default: 'other...',
      },
        
            photo: {
            
              type: String, 
          },
             description: 
             {
                type: String,
             
              },
              bonus: {
      
                type: Number, 
              },
    },
        
      {
       timestamps: true 
      }
);




const Parcel = mongoose.model('parcel', parcelSchema);

module.exports = { Parcel }