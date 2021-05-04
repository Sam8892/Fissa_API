const mongoose = require('mongoose');


const parcelSchema = mongoose.Schema(
    {  
      description: 
      {
         type: String,
        // require:true

       },  
      
    weight: {
      
        type: String, 
      },
      parcelType: {
        type: String,
        enum: [
            'clothing',
			      'electronic',
            'books',
            'documents',
            'food',
            'other...'
            
        ],
        default: 'other...',
      },
      dimension: {
        type: String,
        enum: [
            'small',
			      'medium',
            'large',
            'very large'
       
        ],
        default: 'medium',
         },
        
            photo: {
            
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