
const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'transport',
        'travel',
        'purchase',
      ],
      default: 'travel',
    },
    departure: {

      type: String,
    },
    destination: {

      type: String,
    },
    departureDate: {
      type: Date
    },
    arivalDate: {
      type: Date
    },
    createdBy:
    {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      require: true
    },
    parcel:
    {
      type: mongoose.Types.ObjectId,
      ref: 'parcel',

    },
    place:{
      type:String
    },
  },
  {
    timestamps: true
  }
);




const Advertisement = mongoose.model('advertisement', advertisementSchema);

module.exports = { Advertisement }