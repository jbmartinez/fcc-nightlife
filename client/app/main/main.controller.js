'use strict';

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, $http, $cookies, $window, Auth) {
    console.log('C:', $cookies.search);
    $scope.venues = [];
    $scope.formSubmitted = false;
    $scope.location = '';

    var search = '';

    $scope.search = function() {
      search = $scope.location;
      $http.get('/api/venues/location/' + $scope.location).success(function(venues) {
        $scope.venues = venues;
      });
      $scope.formSubmitted = true;
      if ($cookies.get('search')) {
        $cookies.remove('search');
      }
    };
    
    if ($cookies.get('search')) {
      $scope.location = $cookies.get('search');
      $scope.search();
    }
    
    $scope.toggleCount = function(index) {
      var newVenue = {};
      if (Auth.isLoggedIn()) {
        if ($scope.venues[index].who) {
          var pos = $scope.venues[index].who.indexOf(Auth.getCurrentUser()._id);
          if (pos === -1) {
            $scope.venues[index].who.push(Auth.getCurrentUser()._id);
          } else {
            $scope.venues[index].who.splice(pos, 1);
          }
          newVenue = {
            who: $scope.venues[index].who
          };
          $http.put('/api/venues/' + $scope.venues[index].id, newVenue);
        } else {
          $scope.venues[index].who = [Auth.getCurrentUser()._id];
          newVenue = {
            id: $scope.venues[index].id,
            who: $scope.venues[index].who
          };
          $http.post('/api/venues/', newVenue);
        }
      } else {
        // $window.location.href = '/auth/twitter';
        $cookies.put('search', search);
        $window.location.href = '/login';
      }
      
      // console.log($scope.venues[index].who);
    };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };
  });
