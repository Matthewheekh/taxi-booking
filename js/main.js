"use strict"

/*
 * Name         : main.js
 * Purpose      : This file is designed to load second on the index.html page, and contains code that runs only on that page.
 *                It contains code that allows user to make bookings by selecting and entering appropriate fields.
 *                It contains code that allows user to interact with the map.
 *                It contains code that interacts with the overall display in the main page.
 *                
 * Team         : 223
 * Author(s)    : Matthew Hee Keng Hou
 * 
 * Last Modified: 20 May 2021
*/

// Web services
const OPEN_CAGE_KEY = "a474155e2ecb40489ba53330a25a4847";
const OPEN_CAGE_URL = "https://api.opencagedata.com/geocode/v1/json";


// getLocation()
// 
// PURPOSE:
//      This function gets a location by making a web service request. 
//      Depending on the startEndStop input, it will call different callback functions.
//      This is to account for the asynchronous execution and ensure that start and end locations are not mixed up.
//      Once the data is created, it makes the web service request.
// 
// ARGUMENTS:
//      name: Name/coordinates of a location.
//      startEndStop: String containing the words: start/end/stop.
//
// RETURNS:
//      None.

function getLocation(name,startEndStop)
{
    let callback = "";

    if (startEndStop == "start")
    {
        callback = "callBackForStart";
    }
    else if (startEndStop == "end")
    {
        callback = "callBackForEnd";
    }
    else if (startEndStop == "stop")
    {
        callback = "callBackForStop";
    }

    let data = {
        q: name,
        key: OPEN_CAGE_KEY,
        jsonp: callback
    };

    webServiceRequest(OPEN_CAGE_URL,data);
}


// displayDraggableMarker()
// 
// PURPOSE:
//      This function first defines a draggable marker. 
//      It uses the given input coordinates to position the marker.
//      It then displays the marker on the map.
// 
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      marker: Marker of the input coordinates.

function displayDraggableMarker(coordinates)
{
    let marker = new mapboxgl.Marker({draggable: true});
    marker.setLngLat(coordinates);
    marker.addTo(map);

    return marker;
}


// onDragEnd()
// 
// PURPOSE:
//      This function takes in an input marker class.
//      It then finds out the coordinates of this marker.
//      It is used after the user drags a marker.   
// 
// ARGUMENTS:
//      marker: A marker class.
//
// RETURNS:
//      coordinates: Coordinates of a location. 

function onDragEnd(marker) 
{
    let coordinates = marker.getLngLat();
    return coordinates;
}


// removeAllMarkers()
// 
// PURPOSE:
//      This function removes markers of all input locations.
//      It first loops through the array of locations and accesses its marker attribute.
//      Then, it removes the marker using via the method remove().
// 
// ARGUMENTS:
//      locations: An array of locations containing a marker attribute.
//
// RETURNS:
//      None.

function removeAllMarkers(locations)
{
    for (let i = 0; i < locations.length; i++)
    {
        locations[i].marker.remove()
    }
}


// availableLayerWithId()
// 
// PURPOSE:
//      This function check if a layer exist using the getLayer method provided by the Map Class. 
// 
// ARGUMENTS:
//      idToCheck: ID of a source/layer.
//
// RETURNS:
//      This function returns true if a layer with the idToCheck exists.
//      This function returns false if a layer with the idToCheck exists.

function availableLayerWithId(idToCheck)
{
    let hasPoly = map.getLayer(idToCheck)
    if (hasPoly !== undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}


// createLocation()
// 
// PURPOSE:
//      This function creates a location instance.
//      It uses the input result to find the name, address, coordinates of a location.
//      It also sets the marker attribute using the location's coordinates.
//      The result from the web service returns a formatted attribute.
//      This formatted attribute is used for the address.
//      The name of the location is set to be the string before the first comma of the formatted attribute.
//      The function then returns the newly created location instance.
// 
// ARGUMENTS:
//      result: Result of the web service call (geocoding).
//
// RETURNS:
//      location: A location instance.

function createLocation(result)
{
    let fullAddress = result.results[0].formatted;
    let nameArray = fullAddress.split(',');

    let name = nameArray[0];
    let address = fullAddress;
    let coordinates = result.results[0].geometry;
    let marker = new mapboxgl.Marker();
    marker.setLngLat(coordinates)

    let location = new Location(name, address, coordinates, marker);
    return location;
}


// deleteLocation()
// 
// PURPOSE:
//      This function deletes a selected location.
//      It first removes all the markers on the map, preventing overlap.
//      It then uses a Booking class method to remove the location.
//      The function then calls appropriate functions to update all elements (markers, polyline, location list) on the page.
// 
// ARGUMENTS:
//      index: Index of the location to be deleted.
//
// RETURNS:
//      None.

function deleteLocation(index)
{
    removeAllMarkers(booking.locations);
    booking.removeLocation(index);
    displayLocations(booking.locations);
    displayPolyLine(booking.locations)
    displayMarkerWithPopUp(booking.locations);
}


// displayLocations()
// 
// PURPOSE:
//      This function first creates a reference to a HTML element.
//      It sets the output variable to an empty string.
//      It loops through the input data, stores the HTML display of the location list into the output variable.
//      A delete button is added next to all intermediate and final locations.
//      It then uses the innerHTML method to display the output.
// 
// ARGUMENTS:
//      data: Booking data.
//
// RETURNS:
//      None.

function displayLocations(data)
{
    let bookingLocationsRef = document.getElementById("bookingLocations");
    let output = "";

    for (let i = 0; i < data.length; i++)
    {
        output += ` <li class="mdl-list__item mdl-list__item--three-line">
                        <span class="mdl-list__item-primary-content verticalMiddle">
                            <span>
                                ${data[i].name}
                            </span>
                            <span class="mdl-list__item-text-body">
                                ${data[i].address}
                            </span>
                        </span>`
        
        if (i != 0)
        {
            output += `<span class="mdl-list__item-secondary-content center">
                            <a class="mdl-list__item-secondary-action" onclick="deleteLocation(${i})"><i
                                    class="material-icons">disabled_by_default</i></a>
                        </span>
                    </li>`
        }
    }

    bookingLocationsRef.innerHTML = output;
}


// displayAll()
// 
// PURPOSE:
//      This function first checks if a booking contains the minimum required locations of 2.
//      If so, it displays a marker with pop up, polyline and location list by calling appropriate functions.
// 
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function displayAll()
{
    const MINIMUM_LOCATIONS_REQUIRED = 2;

    if (booking.locations.length >= MINIMUM_LOCATIONS_REQUIRED)
    {
        displayMarkerWithPopUp(booking.locations);
        displayPolyLine(booking.locations);
        displayLocations(booking.locations);
    } 
}


// callBackForStart()
// 
// PURPOSE:
//      This is a callback function.
//      The result returned is used to create a location instance.
//      It then adds the created location as a starting location into the current booking instance.
//      The function displayAll() is called to display all elements (markers, polyline, location list) on the page.
// 
// ARGUMENTS:
//      result: Result of the web service call (geocoding).
//
// RETURNS:
//      None.

function callBackForStart(result)
{
    let location = createLocation(result);
    booking.addStartLocation(location);  
    displayAll(); 
}


// callBackForEnd()
// 
// PURPOSE:
//      This is a callback function.
//      The result returned is used to create a location instance.
//      It then adds the created location as an ending location into the current booking instance.
//      The function displayAll() is called to display all elements (markers, polyline, location list) on the page.
// 
// ARGUMENTS:
//      result: Result of the web service call (geocoding).
//
// RETURNS:
//      None.

function callBackForEnd(result)
{
    let location = createLocation(result);
    booking.addEndLocation(location);
    displayAll();     
}


// callBackForStop()
// 
// PURPOSE:
//      This is a callback function.
//      The result returned is used to create a location instance.
//      It then adds the created location as a stop location into the current booking instance.
//      The function displayAll() is called to display all elements (markers, polyline, location list) on the page.
// 
// ARGUMENTS:
//      result: Result of the web service call (geocoding).
//
// RETURNS:
//      None.

function callBackForStop(result)
{
    let location = createLocation(result);
    booking.addStopLocation(location);
    displayAll(); ;
}


// addStop()
// 
// PURPOSE:
//      This function creates a reference to a HTML element to obtain the stop location.
//      The location is then stored. 
//      All markers on the map is removed to prevent overlapping when calling getLocation().
//      The function getLocation() is then called which will add a stop and display the necessary elements.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function addStop()
{
    let stopLocationRef = document.getElementById("stopLocation");
    let stopLocation = stopLocationRef.value;

    removeAllMarkers(booking.locations);
    
    getLocation(stopLocation,"stop");
}


// coordinatesToString()
// 
// PURPOSE:
//      This function uses the input coordinates and converts it into a string.
//      It uses the lat and lng attributes of the coordinates to do so.
// 
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      stringCoordinates: Coordinates in string format.

function coordinatesToString(coordinates)
{
    let stringCoordinates = `${coordinates.lat},${coordinates.lng}`;
    return stringCoordinates;
}


// addStartLocationByMap()
// 
// PURPOSE:
//      This function first creates a reference to the input field for starting location.
//      It then displays a draggable marker on the map and stores it as startMarker.
//      A location instance is created and added to the current booking instance.
//      It converts the coordinates into a string and writes it to the input field.
//      The draggable marker previously created is then returned.
//
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      startMarker: Marker instance for starting location.

function addStartLocationByMap(coordinates)
{
    let startLocationRef = document.getElementById("startLocation");
    let startMarker = displayDraggableMarker(coordinates);

    let location = new Location("Start","Starting Address", coordinates, startMarker);
    booking.addStartLocation(location);
    
    let stringCoordinates = coordinatesToString(coordinates);
    startLocationRef.value = "";
    startLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);

    return startMarker;
}


// addEndLocationByMap()
// 
// PURPOSE:
//      This function first creates a reference to the input field for ending location.
//      It then displays a draggable marker on the map and stores it as endMarker.
//      A location instance is created and added to the current booking instance.
//      It converts the coordinates into a string and writes it to the input field.
//      The draggable marker previously created is then returned.
//
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      endMarker: Marker instance for ending location.

function addEndLocationByMap(coordinates)
{
    let endLocationRef = document.getElementById("endLocation");
    let endMarker = displayDraggableMarker(coordinates);

    let location = new Location("End","Ending Address", coordinates, endMarker);
    booking.addEndLocation(location);
    
    let stringCoordinates = coordinatesToString(coordinates);
    endLocationRef.value = "";
    endLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);

    return endMarker;
}


// addStopLocationByMap()
// 
// PURPOSE:
//      This function first creates a reference to the input field for stop location.
//      It converts the coordinates into a string and writes it to the input field.
//      The function addStop() is called, which adds the stop and displays all elements appropriately.
//
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      None.

function addStopLocationByMap(coordinates)
{
    let stopLocationRef = document.getElementById("stopLocation");
    
    let stringCoordinates = coordinatesToString(coordinates);
    stopLocationRef.value = "";
    stopLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);

    addStop();
}


// showMyLocation()
// 
// PURPOSE:
//      This function will find the user's location.
//      It displays a marker at the users location and zooms to it.
//      The marker is also draggable to allow users to fine-tune it.
//      It converts the user's coordinates into a string.
//      It creates a reference to the starting input field and writes the coordinates to it.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function showMyLocation()
{
    navigator.geolocation.getCurrentPosition((position) => {  
        
        let coordinates = {
            lng: position.coords.longitude, 
            lat: position.coords.latitude
        };

        let startMarker = displayDraggableMarker(coordinates);
        
        map.flyTo({
            center: coordinates,
            zoom: 15,
            essential: true
        });

        let stringCoordinates = coordinatesToString(coordinates);
        let startLocationRef = document.getElementById("startLocation");
        startLocationRef.value = "";
        startLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);

        let location = new Location("Start","Starting Address", coordinates, startMarker);
        booking.addStartLocation(location);

        startMarker.on('dragend', function() {
            coordinates = onDragEnd(startMarker);
            
            let stringCoordinates = coordinatesToString(coordinates);
            startLocationRef.value = "";
            startLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);
        });

    });
}


// clearData()
// 
// PURPOSE:
//      This function refreshes the page when it is called by the clear button in main.
// 
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function clearData()
{
    location.reload();
}


// checkIfPastBooking()
// 
// PURPOSE:
//      This function first creates a new variable which obtains the current date.
//      The function then obtains the current time using the getTime() function.
//      The function then compares the current time with the time of the booking to be scheduled.
//      If the current time has already past the to-be scheduled booking time, an alert will pop-up, not allowing user to schedule a 
//      booking for a past date.
//
// ARGUMENTS:
//      date: Date of the scheduled booking.
//
// RETURNS:
//      This function returns true if it is a past booking time.
//      This function returns false if it is not a past booking time.

function checkIfPastBooking(date)
{
    let currentTime = new Date();

    if (currentTime.getTime() > date.getTime())
    {
        alert("Invalid date selection! Please select an appropriate date!");
        return true;
    }

    return false;
}


// confirmSelection()
// 
// PURPOSE:
//      This function first creates references to the start, end and date input fields.
//      It runs a condition check to ensure that everything is filled.
//      If some inputs are empty, an alert or an error message will appear and the function exits.
//      If everything is filled, all markers are removed to prevent overlap.
//      All locations in the current booking instance are removed which allows users to confirm selections multiple times.
//      A date instance is created with the user's input.
//      It then gets the location of the input addresses.
//
// ARGUMENTS:
//      coordinates: Coordinates of a location.
//
// RETURNS:
//      startMarker: Marker instance for starting location.

function confirmSelection() 
{
    let startLocationRef = document.getElementById("startLocation");
    let endLocationRef = document.getElementById("endLocation");
    let dateTimeRef = document.getElementById("dateTime");

    let startLocation = startLocationRef.value;
    let endLocation = endLocationRef.value;
    let dateTime = dateTimeRef.value;
    
    let startErrorRef = document.getElementById("startError");
    let endErrorRef = document.getElementById("endError");
    let error = 0;

    if (startLocation == "")
    {
        startErrorRef.innerHTML = "Input is blank!";
        error = 1;
    }

    if (endLocation == "")
    {
        endErrorRef.innerHTML = "Input is blank!";
        error = 1;
    }

    if (dateTime == "")
    {
        alert("Please select a date and time!");
        error = 1;
    }
    
    if (error)
    {
        return;
    }
    else
    {
        booking.date = new Date(dateTime);
        let pastBooking = checkIfPastBooking(booking.date);

        if (pastBooking == false)
        {
            removeAllMarkers(booking.locations);
            booking.removeAllLocations();
    
            getLocation(startLocation,"start");
            getLocation(endLocation,"end");
        }
        else
        {
            return;
        }
    }
}


// selectTaxi()
// 
// PURPOSE:
//      This function first creates a reference to the taxi input.
//      It checks if the input is filled.
//      If it is blank, an alert appears and the function returns.
//      Else, it will calculate the distance and fare of the booking.
//      It then displays it onto the HTML page.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function selectTaxi()
{
    let taxiTypeRef = document.getElementById("taxiType");
    let totalDistanceRef = document.getElementById("totalDistance");
    let totalFareRef = document.getElementById("totalFare");

    if (taxiTypeRef.value == "")
    {
        alert("Please choose a type of taxi for your booking");
        return;
    }

    booking.taxiType = taxiTypeRef.value;
    booking.calculateDistance();
    booking.calculateFare();

    totalDistanceRef.innerHTML = `<h5>${booking.totalDistance} km</h5>`;
    totalFareRef.innerHTML = `<h5>RM ${booking.totalFare}</h5>`;

    displayLocations(booking.locations);
}


// saveData()
// 
// PURPOSE:
//      This function first creates a reference to all HTML input fields.
//      Condition checks are run.
//      If all inputs are filled, it will set all the marker attribute to null.
//      This is to prevent circle reference error when storing in local storage.
//      It then sets the booking name to be final destination of that particular booking.
//      It then stores the data using a key.
//      This storage is only temporary and will be removed once it enters the summary page.
//      It finally directs the users to the summary page.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function saveData() 
{
    let startLocationref = document.getElementById('startLocation');
    let endLocationref = document.getElementById('endLocation');
    let dateTimeref = document.getElementById('dateTime');
    let taxiTyperef = document.getElementById('taxiType');

    let startLocation = startLocationref.value;
    let endLocation = endLocationref.value;
    let dateTime = dateTimeref.value;
    let taxiType = taxiTyperef.value;

    if (startLocation == "") 
    {
        alert("Please enter your starting location");
    }
    else if (endLocation == "") 
    {
        alert("Please enter your Destination");
    }
    else if (dateTime == "") 
    {
        alert("Please choose a date for your booking");
    }
    else if (taxiType == "") 
    {
        alert("Please choose a type of taxi for your booking");
    }
    else if (booking.taxiType == "")
    {
        alert("Please confirm a type of taxi for your booking");
    }
    else 
    {
        for (let i = 0; i < booking.locations.length; i++)
        {
            booking.locations[i].marker = null;
        }

        booking.bookingName = booking.locations[booking.locations.length - 1].name;

        updateData(SINGLE_BOOKING_KEY, booking);
        window.location = "summary.html";
    }
}


mapboxgl.accessToken = MAP_BOX_TOKEN;

let map = new mapboxgl.Map({
        container: 'map',
        center: [101.58113, 3.08872],
        zoom: 15,
        style: 'mapbox://styles/mapbox/streets-v9'
});

let numberOfMarkers = 0;
let booking = new Booking();


// This section handles users clicking on the map to add locations.
// It stores the input coordinates and also creates marker instances.
// Condition checks are ran to ensure that users do not have more than 2 markers when selecting start and end location.
// It then updates the coordinates into the input fields.
// The start and end markers are also draggable.
// Once users have confirm selections, the map will allow users to drop more markers.
// Everything users drop more markers, a stop location is added immediately.
// The stop marker is not draggable.

map.on('click', function (e) {
    
    let startLocationRef = document.getElementById("startLocation");
    let endLocationRef = document.getElementById("endLocation");

    let coordinates = e.lngLat;
    numberOfMarkers++;

    let startMarker = new mapboxgl.Marker();
    let endMarker = new mapboxgl.Marker();

    if (numberOfMarkers <= 2)
    {
        if (startLocationRef.value == "" && endLocationRef.value == "")
        {
            if (numberOfMarkers == 1)
            {
                startMarker = addStartLocationByMap(coordinates);
            }
            else
            {
                endMarker = displayDraggableMarker(coordinates);
                
                let stringCoordinates = coordinatesToString(coordinates);
                endLocationRef.value = "";
                endLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);
            }
        }
        else if (startLocationRef.value == "")
        {
            startMarker = addStartLocationByMap(coordinates);
        }
        else if (endLocationRef.value == "")
        {
            endMarker = addEndLocationByMap(coordinates);
        }
        else if (availableLayerWithId("route") == true)
        {
        addStopLocationByMap(coordinates);
        }
        else
        {
            alert("Both starting and ending fields have been entered");
        }
    }
    else if (availableLayerWithId("route") == true)
    {
        addStopLocationByMap(coordinates);
    }
    else
    {
        alert("Both starting and ending fields have been entered");
    }
    

    startMarker.on('dragend', function() {
        coordinates = onDragEnd(startMarker);
        
        let stringCoordinates = coordinatesToString(coordinates);
        startLocationRef.value = "";
        startLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);
    });

    endMarker.on('dragend', function() {
        coordinates = onDragEnd(endMarker);
        
        let stringCoordinates = coordinatesToString(coordinates);
        endLocationRef.value = "";
        endLocationRef.parentNode.MaterialTextfield.change(stringCoordinates);
    });

});



