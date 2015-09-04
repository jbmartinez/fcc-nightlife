'use strict';

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, $http, $cookies, $window, Auth) {
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
      // if ($cookies.get('search')) {
      //   $cookies.remove('search');
      // }
    };
    
    // if ($cookies.get('search')) {
    var previousSearch = localStorage.getItem('search');
    if (previousSearch) {
      // $scope.location = $cookies.get('search');
      // $scope.search();
      $scope.venues = JSON.parse(previousSearch);
      $scope.formSubmitted = true;
      localStorage.removeItem('search');
      //$cookies.remove('search');
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
        // $cookies.put('search', search);
        localStorage.setItem('search', JSON.stringify($scope.venues));
        console.log('cookie: ', localStorage.getItem('search'));
       //  $window.location.href = '/login';
      }
      
      // console.log($scope.venues[index].who);
    };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };
  });
