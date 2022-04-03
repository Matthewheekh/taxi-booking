"use strict"

/*
 * Name         : shared.js
 * Purpose      : This file is designed to load on all html pages.
 *                It contains the definition for all classes.
 *                It contains the key constants for local storage.
 *                It contains shared functions.
 *                
 * Team         : 223
 * Author(s)    : Matthew Hee Keng Hou
 *                Kevin Lim Jian Hao
 *                Tan Zhi Jian
 *                Cameron Kon Thai Hin
 * 
 * Last Modified: 20 May 2021
*/

// Key for local storage
const BOOKING_DATA_KEY = "bookingData";
const SINGLE_BOOKING_KEY = "singleBookingData"
const INDEX_KEY = "indexData"

// Map box token
const MAP_BOX_TOKEN = "pk.eyJ1IjoibWF0dGhld2hlZWtoIiwiYSI6ImNrbzNvNzljdjA4bmgycG5tcjBzbTNnaXoifQ.FhfBjus-0uLhQNLdZvqVhg";


class Location 
{
    constructor(name, address, coordinates, marker) 
    {
        this._name = name;
        this._address = address;
        this._coordinates = coordinates;
        this._marker = marker;
    }

    get name() 
    {
        return this._name;
    }

    get address() 
    {
        return this._address;
    }

    get coordinates() 
    {
        return this._coordinates;
    }

    get marker()
    {
        return this._marker;
    }

    set marker(marker)
    {
        this._marker = marker;
    }

    // fromData()
    // 
    // PURPOSE:
    //      This method is responsible for restoring the data into its respective classes.
    //      It uses the properties of the given data object.
    // 
    // ARGUMENTS:
    //      dataObject: Data to be restored.
    //
    // RETURNS:
    //      None.

    fromData(dataObject) 
    {
        this._name = dataObject._name;
        this._address = dataObject._address;
        this._coordinates = dataObject._coordinates;
        this._marker = dataObject.marker;
    }
}


class Booking 
{
    constructor() 
    {
        this._bookingName = "";
        this._locations = [];
        this._totalDistance = 0;
        this._totalFare = 0;
        this._date = new Date();
        this._taxiType = "";
    }

    get bookingName()
    {
        return this._bookingName;
    }

    get locations() 
    {
        return this._locations;
    }

    get totalDistance() 
    {
        return this._totalDistance;
    }

    get totalFare() 
    {
        return this._totalFare;
    }

    get date()
    {
        return this._date;
    }

    get taxiType() 
    {
        return this._taxiType;
    }

    set bookingName(name)
    {
        this._bookingName = name;
    }

    set totalDistance(totalDistance) 
    {
        this._totalDistance = totalDistance;
    }

    set totalFare(totalFare) 
    {
        this._totalFare = totalFare;
    }

    set date(date) 
    {
        this._date = date;
    }

    set taxiType(taxiType) 
    {
        this._taxiType = taxiType;
    }

    // addStartLocation()
    // 
    // PURPOSE:
    //      This method adds a starting location using the method unshift().
    //      It adds the starting location in front of the locations array.
    // 
    // ARGUMENTS:
    //      location: A location instance.
    //
    // RETURNS:
    //      None.

    addStartLocation(location) 
    {
        this._locations.unshift(location);
    }

    // addEndLocation()
    // 
    // PURPOSE:
    //      This method adds an ending location using the method push().
    //      It adds the ending location at the back of the locations array.
    // 
    // ARGUMENTS:
    //      location: A location instance 
    //
    // RETURNS:
    //      None.

    addEndLocation(location) 
    {
        this._locations.push(location);
    }

    // addStopLocation()
    // 
    // PURPOSE:
    //      This method checks if there is more than 1 location in the locations array.
    //      If there is more than 1, the ending location was not previously deleted.
    //      It then adds the stop one position before the ending location.
    //      If it is not more than 1, the method pushes the stop to the end of the array.
    // 
    // ARGUMENTS:
    //      stop: A stop location instance.
    //
    // RETURNS:
    //      None.

    addStopLocation(stop)
    {
        let indexBeforeLastElement = this._locations.length - 1;

        if (this._locations.length > 1)
        {
            this._locations.splice(indexBeforeLastElement, 0, stop);
        }
        else
        {
            this._locations.push(stop);
        }
    }

    // getStartLocation()
    // 
    // PURPOSE:
    //      This method returns the starting location in the locations array.
    // 
    // ARGUMENTS:
    //      None.
    //
    // RETURNS:
    //      A location instance is returned.

    getStartLocation()
    {
        return this._locations[0];
    }

    // getEndLocation()
    // 
    // PURPOSE:
    //      This method returns the last location in the locations array.
    // 
    // ARGUMENTS:
    //      None.
    //
    // RETURNS:
    //      A location instance is returned.

    getEndLocation()
    {
        let endIndex = this._locations.length - 1;
        
        return this._locations[endIndex];
    }

    // removeLocation()
    // 
    // PURPOSE:
    //      This method removes a location from the array based on the given index.
    // 
    // ARGUMENTS:
    //      index: Index of a location.
    //
    // RETURNS:
    //      None.

    removeLocation(index) 
    {
        this._locations.splice(index, 1);
    }

    // removeAllLocations()
    // 
    // PURPOSE:
    //      This method removes all locations by re-initializing an empty locations array.
    // 
    // ARGUMENTS:
    //      None.
    //
    // RETURNS:
    //      None.

    removeAllLocations()
    {
        this._locations = [];
    }

    // calculateDistance()
    // 
    // PURPOSE:
    //      This method calculates the distance between two adjacent points.
    //      The haversine formula is used to calculate the distance.
    //      It loops through the entire locations array until all adjacent point distances have been calculated.
    //      It then sums all of it up and sets the distance attribute in two decimal places.
    // 
    // ARGUMENTS:
    //      None.
    //
    // RETURNS:
    //      None.

    calculateDistance() 
    {
        this._totalDistance = 0;

        for (let i = 0; i < this._locations.length - 1; i++) 
        {
            let lat1 = this._locations[i].coordinates.lat;
            let lat2 = this._locations[i+1].coordinates.lat;
            
            let lon1 = this._locations[i].coordinates.lng;
            let lon2 = this._locations[i+1].coordinates.lng;
            
            const R = 6371;
            const PHI1 = lat1 * Math.PI/180;
            const PHI2 = lat2 * Math.PI/180;
            const DELTA_PHI = (lat2 - lat1) * Math.PI/180;
            const DELTA_LAMBDA = (lon2 - lon1) * Math.PI/180;

            const a = Math.sin(DELTA_PHI/2) * Math.sin(DELTA_PHI/2) + 
                      Math.cos(PHI1) * Math.cos(PHI2) * Math.sin(DELTA_LAMBDA/2) * Math.sin(DELTA_LAMBDA/2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            let d = R * c;

            this._totalDistance += d;
        }

        this._totalDistance = this._totalDistance.toFixed(2);
    }

    // calculateFare()
    // 
    // PURPOSE:
    //      This method calculates the fare of a trip based on the given fare structure.
    //      It has a flag rate of RM 3. It then increments the fare based on distance.
    //      Then, it checks if its an advance booking by checking if it is occuring in the future.
    //      It also checks the booking time to see if a 50% night levy should be applied.
    //      On top of all, it adds an additional levy based on taxi type.
    // 
    // ARGUMENTS:
    //      None.
    //
    // RETURNS:
    //      None.

    calculateFare()
    {
        const FLAG_RATE = 3;
        const DISTANCE_RATE = 0.10/0.115;
        const ADVANCED_BOOKING = 2;
        const NIGHT_LEVY = 1.5;

        const SUV = 5;
        const VAN = 10;
        const MINIBUS = 15;

        let currentDate = new Date();
        this._totalFare = FLAG_RATE;
        this._totalFare += this._totalDistance * DISTANCE_RATE;

        if (this._date > currentDate)
        {
            if (this._date.getFullYear() > currentDate.getFullYear())
            {
                this._totalFare += ADVANCED_BOOKING;
            }
            else if (this._date.getMonth() > currentDate.getMonth())
            {
                this._totalFare += ADVANCED_BOOKING;
            }
            else if (this._date.getDate() > currentDate.getDate())
            {
                this._totalFare += ADVANCED_BOOKING;
            } 
        }

        if (this._date.getHours() >= 0 && this._date.getHours() < 6)
        {
            this._totalFare *= NIGHT_LEVY; 
        }

        if (this._taxiType == "SUV")
        {
            this._totalFare += SUV;
        }
        else if (this._taxiType == "Van")
        {
            this._totalFare += VAN;
        }
        else if (this._taxiType == "Minibus")
        {
            this._totalFare += MINIBUS;
        }

        this._totalFare = this._totalFare.toFixed(2);
    }

    // fromData()
    // 
    // PURPOSE:
    //      This method is responsible for restoring the data into its respective classes.
    //      It uses the properties of the given data object.
    //      It then creates an array.
    //      It loops through the locations and restores all the classes within and pushes it back into the array.
    // 
    // ARGUMENTS:
    //      dataObject: Data to be restored.
    //
    // RETURNS:
    //      None.

    fromData(dataObject) 
    {
        this._bookingName = dataObject._bookingName;
        this._totalDistance = dataObject._totalDistance;
        this._totalFare = dataObject._totalFare;
        this._date = new Date(dataObject._date);
        this._taxiType = dataObject._taxiType;

        this._locations = [];

        for (let i = 0; i < dataObject._locations.length; i++)
        {
            let location = new Location();
            location.fromData(dataObject._locations[i]);
            this._locations.push(location);
        }
    }
}


class BookingList 
{
    constructor() 
    {
        this._bookings = [];
    }

    get bookings() 
    {
        return this._bookings;
    }

    // addBooking()
    // 
    // PURPOSE:
    //      This method pushes a booking instance into the list of bookings.
    // 
    // ARGUMENTS:
    //      booking: A booking instance.
    //
    // RETURNS:
    //      None.

    addBooking(booking) 
    {
        this._bookings.push(booking);
    }

    // removeBooking()
    // 
    // PURPOSE:
    //      This method removes a booking instance from the list of bookings.
    // 
    // ARGUMENTS:
    //      index: Index of a booking in the list of bookings.
    //
    // RETURNS:
    //      None.

    removeBooking(index) 
    {
        this._bookings.splice(index, 1);
    }

    // getBooking()
    // 
    // PURPOSE:
    //      This method finds a booking instance using an index from the booking list.
    // 
    // ARGUMENTS:
    //      index: Index of a booking in the list of bookings.
    //
    // RETURNS:
    //      This method returns the booking instance found.

    getBooking(index) 
    {
        return this._bookings[index];
    }

    // fromData()
    // 
    // PURPOSE:
    //      This method is responsible for restoring the data into its respective classes.
    //      It first creates an array.
    //      It then loops through the booking list and restores all the classes within and pushes it back into the array.
    // 
    // ARGUMENTS:
    //      dataObject: Data to be restored.
    //
    // RETURNS:
    //      None.

    fromData(dataObject) 
    {
        let bookingList = dataObject._bookings;
        this._bookings = [];

        for (let i = 0; i < bookingList.length; i++) 
        {
            let booking = new Booking();
            booking.fromData(bookingList[i]);
            this._bookings.push(booking);
        }
    }
}


// removeLayerWithId()
// 
// PURPOSE:
//      This function check if a layer exist using the getLayer method provided by the Map Class. 
//      If it exists, the layer and source is removed using methods provided by the Map CLass.
// 
// ARGUMENTS:
//      idToRemove: ID of a source/layer.
//
// RETURNS:
//      None.

function removeLayerWithId(idToRemove)
{
	let hasPoly = map.getLayer(idToRemove)
	if (hasPoly !== undefined)
	{
		map.removeLayer(idToRemove)
		map.removeSource(idToRemove)
	}
}


// displayPolyLine()
// 
// PURPOSE:
//      This function displays a polyline connecting all locations. 
//      First, it pushes the coordinates of all locations into an array.
//      The function removeLayerWithId() is called to remove any existing layers, preventing overlaps.
//      The source and layer of the polyline is then added to the map using methods provided by the Map Class.
//      The function also fits the bounds of the polyline by passing in the first coordinates.
//      The bounds are then extended to include the last coordinates.
// 
// ARGUMENTS:
//      locations: Class instances of locations.
//
// RETURNS:
//      None.

function displayPolyLine(locations)
{
    let coordinates = [];

    for (let i = 0; i < locations.length; i++)
    {
        coordinates.push([locations[i].coordinates.lng,locations[i].coordinates.lat]);
    }

    removeLayerWithId('route');

    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': coordinates
            }
        }
    });

    map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 6 }
    });

    let bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
         
    map.fitBounds(bounds, {
        padding: {top: 50, bottom:20, left: 20, right: 20}
    });
}


// displayMarkerWithPopUp()
// 
// PURPOSE:
//      This function displays markers with the respective popups.
//      It loops through every location, adds a marker based on the location's coordinates.
//      The popup is then added based on the location's name and address.
//      Then, the marker and popup is added to the map.
// 
// ARGUMENTS:
//      locations: Class instances of locations.
//
// RETURNS:
//      None.

function displayMarkerWithPopUp(locations)
{
    for (let i = 0; i < locations.length; i++)
    {
        let marker = locations[i].marker
	
        let popup = new mapboxgl.Popup({ offset: 45});
        popup.setHTML(`<b>${locations[i].name}</b> <br> ${locations[i].address}`);
        marker.setPopup(popup)

        marker.addTo(map);
        popup.addTo(map);
    }
}


// assignTaxi() 
// 
// PURPOSE:
//      This function is used to assign taxis in both the summary and details page.
//      It first loops through the taxi list until it finds the selected taxi type and checks for availability.
//      If a taxi is found, an alert appears to inform the user that a taxi has been found.
//      Else, an alert will inform the user to select a new type of taxi.
// 
// ARGUMENTS:
//      taxiType: Type of taxi the user chooses.
//
// RETURNS:
//      This function returns true if a taxi has been assigned.
//      This function returns false if a taxi has not been assigned.

function assignTaxi(taxiType)
{
    for(let i = 0; i < taxiList.length; i++)
    {
        if (taxiList[i].type == taxiType && taxiList[i].available == true)
        {
            alert(`Successfully assigned taxi ${taxiList[i].rego}!`);
            return true;
        }
    }

    alert("This type of taxi is unavailable for now, please select a new taxi!");
    return false;
}


// checkData()
// 
// PURPOSE:
//      This function checks if local storage is available.
//      If local storage is available, the function will proceed to check if there is data stored in local storage at the given key.
//      If local storage is unavailable, an error will be shown in the console.
// 
// ARGUMENTS:
//      key: Key to a value pair. 
//
// RETURNS:
//      This function returns true if there is data stored at the given key.
//      This function returns false if there is no data stored at the given key or data stored is null.

function checkData(key) 
{   
    if (typeof (localStorage) !== "undefined") 
    {   
        if (localStorage.getItem(key) != null)
        {
            return true;
        }
        else
        {
            return false;
        }    
    }
    else 
    {
        console.log("Local storage is not available!");
    }
}


// updateData()
// 
// PURPOSE:
//      This function updates data in the local storage with a given key.
//      It first turns the data into a string.
//      It then stores the string using the given key.
// 
// ARGUMENTS:
//      key: Key to a value pair.
//      data: Data to be stored.
//
// RETURNS:
//      None.

function updateData(key, data) 
{
    let stringData = JSON.stringify(data);
    localStorage.setItem(key, stringData);
}


// getData()
// 
// PURPOSE:
//      This function retrives data from the local storage using the given key.
//      It then tries to parse the data back into an object.
//      However, if an error occurs, it will catch it and print the error onto the console.
//      It then returns the data that is stored at the given key.
// 
// ARGUMENTS:
//      key: Key to a value pair.
//
// RETURNS:
//      This function returns the data that is stored at the given key.

function getData(key) 
{
    let data = localStorage.getItem(key);

    try 
    {
        data = JSON.parse(data);
    }
    catch (e) 
    {
        console.log(e);
    }
    finally 
    {
        return data;
    }
}


// A new booking list instance is created
let bookingList = new BookingList();

// Check if data exists at the given key
let dataExist = checkData(BOOKING_DATA_KEY);

if (dataExist == true)
{
    let data = getData(BOOKING_DATA_KEY);

    // Restore the data into its class
    bookingList.fromData(data)
}
