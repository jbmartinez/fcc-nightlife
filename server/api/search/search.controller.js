'use strict';

var _ = require('lodash');
var Search = require('./search.model');
var config = {
  'secrets' : {
    'clientId': process.env.FOURSQ_ID,
    'clientSecret': process.env.FOURSQ_SECRET,
    'redirectUrl': process.env.FOURSQ_REDIRECT
  }
};

var foursquare = require('node-foursquare')(config);

// Get list of searchs
// exports.index = function(req, res) {
//   Search.find(function (err, searchs) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(searchs);
//   });
// };
exports.index = function(req, res) {
  // Search.find(function (err, searchs) {
  var params = {section: 'coffee', venuePhotos: 1};
  foursquare.Venues.explore(null, null, 'New York, NY', params, null, function(err, searchs) {
    if(err) { return handleError(res, err); }
    var results = searchs.groups[0].items
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
    // return res.status(200).json(searchs);
  });
  // });
};

// Get a single search
exports.show = function(req, res) {
  Search.findById(req.params.id, function (err, search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.status(404).send('Not Found'); }
    return res.json(search);
  });
};

// Creates a new search in the DB.
exports.create = function(req, res) {
  Search.create(req.body, function(err, search) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(search);
  });
};

// Updates an existing search in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Search.findById(req.params.id, function (err, search) {
    if (err) { return handleError(res, err); }
    if(!search) { return res.status(404).send('Not Found'); }
    var updated = _.merge(search, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(search);
    });
  });
};

// Deletes a search from the DB.
exports.destroy = function(req, res) {
  Search.findById(req.params.id, function (err, search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.status(404).send('Not Found'); }
    search.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}