/************menu list display************/
var menuListDisplay = function(item) {
  this.name = ko.observable(item.venue.name);
  this.address = ko.observable(item.venue.location.formattedAddress);
};

/******* view and Model*******/
var viewModel = function() {
  var self = this; //edit
  self.menuList = ko.observableArray([]);
  var places = [];
  var pointers = []; // edited
  self.queryList = ko.observableArray([]);
  self.filterSearch = ko.observable('');
  var pointerinfoWindow = new google.maps.InfoWindow();


  /*********Getting the bounds for the maps*************/
  self.locationLatLng = function() {

    var location = "Brooklyn";
    var placeType = "Restaurant";
    // FourSquare API
    var api = 'https://api.foursquare.com/v2/venues/explore?&client_id=CCV5AKSBUOLRTQIWOGBC4ZTT3LNG0012IHGRCKOAUNAAUPAL&client_secret=3S4N5THI4SY3WRTCUZJDSFSRTKRPQOLLQUH5P0MPKOGNAG3H&v=20170408&near=' + location + '&query=' + placeType;
    //Get json data from API and setting the bounds
    $.getJSON(api, function(data) {
      var latLng = new google.maps.LatLngBounds(
        new google.maps.LatLng(data.response.suggestedBounds.sw.lat, data.response.suggestedBounds.sw.lng),
        new google.maps.LatLng(data.response.suggestedBounds.ne.lat, data.response.suggestedBounds.ne.lng));
      mapData.fitBounds(latLng);
      mapData.setCenter(latLng.getCenter());
      locationList(data.response.groups[0].items);
    });
    $('#search-error').hide();
    $('#no-result').hide();
  };

  self.locationLatLng();
  /***********cleaning the maps of pointers*********/
  function cleanPointers() {
    var i = 0;
    while (i < pointers.length) {
      pointers[i].setMap(null);
      i++;
    }
  }

  /********adding the places to the array placeList********/
  function locationList(listData) {
    listData.forEach(function(placeItem) {
      self.menuList.push(new menuListDisplay(placeItem));
      places.push(placeItem.venue);
    });
    pointerPlace(places);
    self.queryList(self.menuList());
  }


  /****Info Window****/
  function pointerInfo(data, marker) {
    var restaurantName = data.name;
    var address = data.location.address + ', ' + data.location.city + ', ' + data.location.country;
    var contentString = '<div>' + '<div class="RestaurantName">' + '<h3>' + restaurantName + '</h3>' + '</div>' + '<div class="address">' + address + '</div>' + '</div>';

    google.maps.event.addListener(marker, 'click', function() {
      pointerinfoWindow.setContent(contentString);
      pointerinfoWindow.open(mapData, marker);
    });
  }

  /**********When list item clicked on UI then call this function***********/
  self.listToPointer = function(venue) {

    var placeType = venue.name();
    var i = 0;
    while (i < pointers.length) {
      if (pointers[i].title === placeType) {
        google.maps.event.trigger(pointers[i], 'click');
        mapData.panTo(pointers[i].position);
      }
      i++;
    }

  };

  /***********marking pointer*********/
  function mapMarker(data) {
    var marker = new google.maps.Marker({
      map: mapData,
      title: data.name,
      position: new google.maps.LatLng(data.location.lat, data.location.lng),
      animation: google.maps.Animation.DROP
    });
    pointers.push(marker);
    pointerInfo(data, marker);
    //pointer bounce function
    function toggleBounce() {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    //listener to toggle bounce
    google.maps.event.addListener(marker, 'click', function() {
      toggleBounce();
      setTimeout(toggleBounce, 1500);
    });
  }

  /***************calling mapMarker based on API data****************/
  function pointerPlace(places) {

    var i = 0;
    while (i < places.length) {
      mapMarker(places[i]);
      i++;
    }
  }




  /*************function for clearing filter inputs*********/
  self.resetFilter = function() {

    self.queryList(self.menuList());
    cleanPointers();
    pointerPlace(places);
    $('#no-result').hide();
    $('#search-error').hide();

  };
  /***************Filter Function*********/
  self.filter = function() {
    var filterInput = self.filterSearch().toLowerCase();
    $('#no-result').hide();
    $('#search-error').hide();

    var empytCheck = 0;
    if (!filterInput) {
      $('#search-error').show();
    } else {
      self.queryList([]);
      cleanPointers();
      for (var place = 0, l = self.menuList().length; place < l; place++) {
        if (self.menuList()[place].name().toLowerCase().indexOf(filterInput) !== -1) {
          self.queryList.push(self.menuList()[place]);
          pointers[place].setMap(mapData);
          empytCheck++;
        }

      }
    }
    // Empty Search box check
    console.log(self.queryList);
    if (empytCheck <= 0) {
      $('#no-result').show();
    }

  };


};


/*****************/
/*Google Map Load*/
/*****************/
var mapData;

function googleMap() {
  $('#map-load-failure').hide();
  $('#load-failure').hide();
  var attributes = {
    zoom: 13
  };
  mapData = new google.maps.Map(document.getElementById('map'), attributes);
  $('#map').height($(window).height()); //Adjusting the map to window size
  ko.applyBindings(new viewModel()); // calling the View and Model
}

/***********************/
/*Google API load error*/
/*Google API load error*/
function googleError() {
  $('#map-load-failure').show();
  $('#load-failure').show();
}
