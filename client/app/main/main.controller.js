'use strict';

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, $http) {
    // $scope.awesomeThings = [];

    $scope.venues = [];
    $scope.formSubmitted = false;
    $scope.location = '';
    $scope.search = function() {
      $http.get('/api/venues/location/' + $scope.location).success(function(venues) {
        $scope.venues = venues;
      });

      $scope.formSubmitted = true;
    };

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };
  });
