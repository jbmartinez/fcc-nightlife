'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VenueSchema = new Schema({
  // name: String,
  id: {
    type: String,
    unique: true
  },
  // count: Number,
  who: [String]
});

VenueSchema.path('id').index({unique: true});

module.exports = mongoose.model('Venue', VenueSchema);