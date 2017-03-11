// This is the map script with geolocation support 
// New York is used as the default location if the person's browser does not allow location tracking
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var map;
var pos;
var currentPosLat;
var currentPosLon;
var resultMarkers = [];
var infoWindows = [];

var bookMarkers = [];
var bookWindows = [];

var addBookmarkLocation = {};
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();


function initialize() {

  directionsDisplay = new google.maps.DirectionsRenderer();

  var mapOptions = {
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };


  map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);

        // Try HTML5 geolocation
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
             position.coords.longitude);

            // alert(map.LatLng.lat());
            // Update my current latitude and longitude.
            currentPosLat = String(pos).replace(/\(|\)|\ /g, '').split(',')[0];
            currentPosLon = String(pos).replace(/\(|\)|\ /g, '').split(',')[1];
            $('#location').prop("value", "near me");

            myInfoWindowOptions = {
              content: '<div class="info-window-content"><h4>Current Location</h4></div>',
              maxWidth: 150
            };

            infoWindow = new google.maps.InfoWindow(myInfoWindowOptions);

            var image = new google.maps.MarkerImage(
              'images/glow_dot.gif',
              new google.maps.Size(25,25),
              new google.maps.Point(0,0),
              new google.maps.Point(0,25)
              );



            var marker = new google.maps.Marker({
              draggable: false,
              raiseOnDrag: false,
              icon: image,
              map: map,
              position: pos,
              optimized: false
            });


            google.maps.event.addListener(marker, 'click', function() {
             if (infoWindow.getMap()) {
              infoWindow.close();
            }
            else{
              infoWindow.open(map,marker);
            }
          });

            google.maps.event.addListener(marker, 'dragstart', function(){
              infoWindow.close();
            });
            infoWindow.open(map,marker);
            setTimeout(function(){
              infoWindow.close();
            },2000);

            var center;
            function calculateCenter() {
              center = map.getCenter();
            }
            google.maps.event.addDomListener(map, 'idle', function() {
              calculateCenter();
            });
            google.maps.event.addDomListener(window, 'resize', function() {
              map.setCenter(center);
            });


            map.setCenter(pos);
          }, function() {
            handleNoGeolocation(true);
          });
} else {
          // Browser doesn't support Geolocation
          handleNoGeolocation(false);
        }
        showBookMarks();
      }

      function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
          var content = 'Error: The Geolocation service failed.';
        } else {
          var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
          map: map,
          position: newyork,
          content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
      }






    // This is a test for adding additional markers to the map.
    function addColumbiaMarker(){
      var columbia = new google.maps.LatLng(40.8006,
       -73.9653);
      var marker = new google.maps.Marker({
        draggable: false,
        raiseOnDrag: false,
        icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
        map: map,
        animation: google.maps.Animation.DROP,
        position: columbia
      });
      marker.setMap(map);
    }

    function addMoreResultMarker(location){
      addResultMarker(location, resultMarkers.length)

    }
    function addResultMarker(location, index){

      if(location.display_phone){
        phone = location.display_phone;
      }
      else{
        phone = "No phone  number available";
      }
      var  imgurl;
      // Add the markers for the map
      if(location.image_url != undefined){
        imgurl=location.image_url;
      }
      else{
        imgurl="images/defaultBusiness.png";
      }


      var resultPosition = new google.maps.LatLng(location.location.coordinate.latitude, location.location.coordinate.longitude);
      var address ="";
      for (var i = 0; i < location.location.display_address.length; i++)
        address += location.location.display_address[i] + "<br />";
      var locationStr = JSON.stringify(location).replace(/"/g, "&quot;");
      if(pos){
        resultInfoWindowOptions = {
          content: '<div id="infoWindow'+index+'" class="info-window-content"><div id="iwImage"><img src="'+imgurl+'"></div><div id="data"><div id="iwText"><h4 id="iwName">'+location.name+'</h4><h5>' + phone + '</h5><div>' + address + '</div><br /><img id="iwRating" src="' + location.rating_img_url + '" /></div><button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Add Bookmark" onclick="addBookmarkBtnClick(' + locationStr + ',$(this)); "><i class="icon-bookmark"></i></button></div><button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Get Driving Directions" onclick="calcRoute(' + location.location.coordinate.latitude + ', ' + location.location.coordinate.longitude + ');"><i class="icon-road"></i></button></div></div>',
          maxWidth: 400
        };
      }
      else{
        resultInfoWindowOptions = {
          content: '<div id="infoWindow'+index+'" class="info-window-content"><div id="iwImage"><img src="'+imgurl+'"></div><div id="data"><div id="iwText"><h4 id="iwName">'+location.name+'</h4><h5>' + phone + '</h5><div>' + address + '</div><br /><img id="iwRating" src="' + location.rating_img_url + '" /></div><button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Add Bookmark" onclick="addBookmarkBtnClick(' + locationStr + ',$(this));"><i class="icon-bookmark"></i></button></div></div></div>',
          maxWidth: 400
        };
      }

      info = new google.maps.InfoWindow(resultInfoWindowOptions);
      infoWindows.push(info);

      var marker = new google.maps.Marker({
        draggable: false,
        raiseOnDrag: false,
        icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
        map: map,
        animation: google.maps.Animation.DROP,
        zIndexProcess: "9900",
        position: resultPosition
      });


      google.maps.event.addListener(marker, 'click', function() {
        clearInfoWindows();
        clearBookWindows();
        infoWindows[index].open(map,marker);
      });

      google.maps.event.addListener(marker, 'dragstart', function(){
        infoWindows[i].close();
      });
      resultMarkers.push(marker);
    }


    function addBookMarker(location, index){
      var  imgurl;
      // Add the markers for the map
      if(location.display_phone){
        phone = location.display_phone;
      }
      else{
        phone = "No phone  number available";
      }

      if(location.image_url != undefined){
        imgurl=location.image_url;
      }
      else{
        imgurl="images/defaultBusiness.png";
      }
      var resultPosition = new google.maps.LatLng(location.location.coordinate.latitude, location.location.coordinate.longitude);
      var address ="";
      for (var i = 0; i < location.location.display_address.length; i++)
        address += location.location.display_address[i] + "<br />";
      var locationStr = JSON.stringify(location).replace(/"/g, "&quot;");
      if(pos){
        var bookInfoWindowOptions = {
          content: '<div id="infoWindow'+index+'" class="info-window-content"><div id="iwImage"><img src="'+imgurl+'"></div><div id="data"><div id="iwText"><h4 id="iwName">'+location.name+'</h4><h5>' + phone + '</h5><div>' + address + '</div><br /><img id="iwRating" src="' + location.rating_img_url + '" /></div></div><button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Get Driving Directions" onclick="calcRoute(' + location.location.coordinate.latitude + ', ' + location.location.coordinate.longitude + ');"><i class="icon-road"></i></button></div></div>',
          maxWidth: 400
        };
      }
      else{
        var bookInfoWindowOptions = {
          content: '<div id="infoWindow'+index+'" class="info-window-content"><div id="iwImage"><img src="'+imgurl+'"></div><div id="data"><div id="iwText"><h4 id="iwName">'+location.name+'</h4><h5>' + phone + '</h5><div>' + address + '</div><br /><img id="iwRating" src="' + location.rating_img_url + '" /></div></div></div></div>',
          maxWidth: 400
        };
      }

      info = new google.maps.InfoWindow(bookInfoWindowOptions);
      bookWindows.push(info);

      var marker = new google.maps.Marker({
        draggable: false,
        raiseOnDrag: false,
        icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
        map: map,
        animation: google.maps.Animation.DROP,
        zIndexProcess: "9999",
        position: resultPosition
      });


      google.maps.event.addListener(marker, 'click', function() {
        clearInfoWindows();
        clearBookWindows();
        bookWindows[index].open(map,marker);
      });

      google.maps.event.addListener(marker, 'dragstart', function(){
        bookWindows[i].close();
      });
      bookMarkers.push(marker);
    }









// Removes the overlays from the map, but keeps them in the array
function clearSearchMarks() {
  if (resultMarkers.length > 0) {
    for (i in resultMarkers) {
      resultMarkers[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showSearchMarks() {
  var bounds = new google.maps.LatLngBounds();
  if (resultMarkers.length > 0) {
    for (i in resultMarkers) {
      resultMarkers[i].setMap(map);
      bounds.extend(resultMarkers[i].position);
    }
    map.panToBounds(bounds);
    map.fitBounds(bounds);
  }
}


// Shows any overlays currently in the array
function showBookMarks() {
  if (bookMarkers.length > 0) {
    for (i in bookMarkers) {
      bookMarkers[i].setMap(map);
    }
  }
}

function boundBookMarks() {
  var bookBound = new google.maps.LatLngBounds();

  if (bookMarkers.length > 0) {
    for (i in bookMarkers) {
      bookMarkers[i].setMap(map);
      bookBound.extend(bookMarkers[i].position)
    }
    setTimeout(function(){
      map.panToBounds(bookBound);
      map.fitBounds(bookBound);
    },500);
  }
}


function clearBookMarks() {
  if (bookMarkers.length > 0) {
    for (i in bookMarkers) {
      bookMarkers[i].setMap(null);
    }
  }
}





function deleteBookMarks() {
  if (bookMarkers.length > 0) {
    for (i in bookMarkers) {
      bookMarkers[i].setMap(null);
    }
    bookMarkers.length = 0;
  }
}

// Deletes all markers in the array by removing references to them
function deleteSearchMarks() {
  if (resultMarkers.length > 0) {
    for (i in resultMarkers) {
      resultMarkers[i].setMap(null);
    }
    resultMarkers.length = 0;
  }
}

// Deletes all markers in the array by removing references to them
function deleteInfoWindows() {
  if (infoWindows.length > 0) {
    for (i in infoWindows) {
      infoWindows[i].close();
    }
    infoWindows.length = 0;
  }
}



// Deletes all markers in the array by removing references to them
function deleteBookInfoWindows() {
  if (bookWindows.length > 0) {
    for (i in bookWindows) {
      bookWindows[i].close();
    }
    bookWindows.length = 0;
  }
}



// Deletes all markers in the array by removing references to them
function clearInfoWindows() {
  if (infoWindows.length > 0) {
    for (i in infoWindows) {
      infoWindows[i].close();
    }
  }
}


function clearBookWindows(){
  if (bookWindows.length > 0) {
    for (i in bookWindows) {
      bookWindows[i].close();
    }
  }
}

function calcRoute(endLat, endLng) {
  $("#directions").empty();
  var endPosition = new google.maps.LatLng(endLat, endLng);
  directionsService = new google.maps.DirectionsService()
  var start = pos;
  var request = {
    origin: start,
    destination: endPosition,
    travelMode: google.maps.DirectionsTravelMode.DRIVING

  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

  directionsDisplay.setOptions({
    suppressMarkers:true
  });

  directionsDisplay.setPanel(document.getElementById("directions"));
  $("#directionsModal").modal("show");

}


  // initialize the map
  google.maps.event.addDomListener(window, 'load', initialize);

//map with geolocation ends here
