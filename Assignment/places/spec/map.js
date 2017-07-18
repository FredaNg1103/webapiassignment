/*global google*/
/*global angular*/


var app = angular.module('myApp', []);

app.service('Map', function($q) {
    
    this.init = function() 
    {
        var options = 
        {
            center: new google.maps.LatLng(5.4163459, 100.33276169999999),
            zoom: 13,
            disableDefaultUI: true    
        };
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    };
    
    this.search = function(str) 
    {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) 
        {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    };
    
    this.addMarker = function(res)
    {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker(
            {
            map: this.map,
            position: res.geometry.location,
            
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    };
    
});

app.controller('newPlaceCtrl', function($scope, Map)
{
    
    $scope.place = {};
    
    $scope.search = function() 
    {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res)
            { // success
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.formatted_address=res.formatted_address;
                $scope.place.rating=res.rating;
                $scope.place.price_level= res.price_level;
            },
            function(status) 
            { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    };
    
    
    
    Map.init();
});



