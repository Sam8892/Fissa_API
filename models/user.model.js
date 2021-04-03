const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
       // _id: mongoose.Schema.Types.ObjectId,
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        
        password: {
            type: String,
          
        },
        
        dateOfBirth: {
            type: Date
        },
        cin: {
            type: Number
         },
        description: {
            type: String
        },
        image: {
            type: String
        },
        phoneNumber: {
            type: Number
       },
     
    adress: {
    type: String
    },
    zipCode: {
        type: Number
        },
        city: {
            type: String
            },
            country: {
                type: String
                },
      
    
    publishedAdverts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'advertisement'
     }],
    
    myTransactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'advertisement'
     }]
    },

  
      {
       timestamps: true 
      }
);


userSchema.methods.comparePassword = function (candidatePassword , checkpassword){
    bcrypt.compare(candidatePassword ,this.password, function(err,isMatch){
      if(err)return checkpassword(err) 
       checkpassword (null , isMatch)
      })
  }
//users
const User = mongoose.model('user', userSchema);

module.exports = { User }