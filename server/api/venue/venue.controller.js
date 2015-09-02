'use strict';

var _ = require('lodash');
var Venue = require('./venue.model');
var config = {
  'secrets' : {
    'clientId': process.env.FOURSQ_ID,
    'clientSecret': process.env.FOURSQ_SECRET,
    'redirectUrl': process.env.FOURSQ_REDIRECT
  }
};

var foursquare = require('node-foursquare')(config);

// Get list of venues
// exports.index = function(req, res) {
//   Venue.find(function (err, venues) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(venues);
//   });
// };
exports.index = function(req, res) {
  // Venue.find(function (err, venues) {
  var params = {section: 'coffee', venuePhotos: 1};
  foursquare.Venues.explore(null, null, 'New York, NY', params, null, function(err, venues) {
    if(err) { return handleError(res, err); }
    var results = venues.groups[0].items
      .map(function(item) {
        return {
          id: item.venue.id,
          name: item.venue.name,
          rating: item.venue.rating,
          location: item.venue.location.formattedAddress[0],
          link: 'https://foursquare.com/v/' + item.venue.id,
          photo: item.venue.featuredPhotos.items[0].prefix + '100x100' + item.venue.featuredPhotos.items[0].suffix
        };
      });

    console.log(JSON.stringify(results));
    return res.status(200).json(results);
    // return res.status(200).json(venues);
  });
  // });
};

// Get a single venue
exports.show = function(req, res) {
  Venue.findById(req.params.id, function (err, venue) {
    if(err) { return handleError(res, err); }
    if(!venue) { return res.status(404).send('Not Found'); }
    return res.json(venue);
  });
};

// Creates a new venue in the DB.
exports.create = function(req, res) {
  Venue.create(req.body, function(err, venue) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(venue);
  });
};

// Updates an existing venue in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Venue.findById(req.params.id, function (err, venue) {
    if (err) { return handleError(res, err); }
    if(!venue) { return res.status(404).send('Not Found'); }
    var updated = _.extend(venue, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(venue);
    });
  });
};

// Deletes a venue from the DB.
exports.destroy = function(req, res) {
  Venue.findById(req.params.id, function (err, venue) {
    if(err) { return handleError(res, err); }
    if(!venue) { return res.status(404).send('Not Found'); }
    venue.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}