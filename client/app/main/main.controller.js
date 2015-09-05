'use strict';

angular.module('nightlifeApp')
  .controller('MainCtrl', function ($scope, $http, $cookies, $window, Auth) {
    $scope.venues = [];
    $scope.formSubmitted = false;
    $scope.location = '';
    $scope.userID = Auth.getCurrentUser()._id;
    var ctrl = this;
    ctrl.venueIndex = null;

    $scope.search = function() {
      if (!$scope.search_form.$valid) {
        return false;
      }
      $http.get('/api/venues/location/' + $scope.location).success(function(venues) {
        $scope.venues = venues;
      });
      $scope.formSubmitted = true;
    };
    
    var previousSearch = localStorage.getItem('search');
    if (previousSearch) {
      $scope.venues = JSON.parse(previousSearch);
      $scope.formSubmitted = true;
      localStorage.removeItem('search');
    }

    function updateVenue(index) {
      var newVenue = {};
      if ($scope.venues[index].hasOwnProperty('who')) {
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
    }
    
    function checkLoggedIn(logged) {
      if (logged) {
        updateVenue(ctrl.venueIndex);
      } else {
        localStorage.setItem('search', JSON.stringify($scope.venues));
        $window.location.href = '/auth/twitter';
        // $window.location.href = '/login';
      }
    }

    $scope.toggleCount = function(index) {
      ctrl.venueIndex = index;
      Auth.isLoggedInAsync(checkLoggedIn);
    };
  });
