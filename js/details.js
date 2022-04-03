"use strict"
/*
 * Name         : details.js
 * Purpose      : This file is designed to either:
 *                - load after selecting "Confirm" on the summary.html OR
 *                - load after clicking on the "i" icon in history.html
 *                It contains code that displays all the necessary booking information in display boxes.
 *                It contains code that displays the starting location and destination on the map.
 *                It contains code that allows user to change the type of taxi, which will recalculate the fare for the journey.
 *                It also updates the bookingList data using the specified key. 
 *                
 * Team         : 223
 * Author(s)    : Tan Zhi Jian
 * 
 * Last Modified: 20 May 2021
*/

// restoreMarkers()
// 
// PURPOSE:
//      This function restores the markers by obtaining the location coordinates from the booking data.
//
// ARGUMENTS:
//      index: The index of the booking data in the booking list.
//
// RETURNS:
//      None.
function restoreMarkers(index)
{
    let locations = bookingList.bookings[index].locations;

    for (let i = 0; i < locations.length; i++)
    {
        let marker = new mapboxgl.Marker();
        marker.setLngLat(locations[i].coordinates)
        locations[i].marker = marker;
    }
}

// removeMarkers()
// 
// PURPOSE:
//      This function removes markers from the booking data.
//      It first loops through the array of locations and accesses its marker attribute.
//      Then, it removes the marker by setting its value to null.
// 
// ARGUMENTS:
//      index: The index of the booking data in the booking list.
//
// RETURNS:
//      None.

function removeMarkers(index)
{
    let locations = bookingList.bookings[index].locations;

    for (let i = 0; i < locations.length; i++)
    {
        locations[i].marker = null;
    }
}

// checkIfFuture()
// 
// PURPOSE:
//      This function checks the date of the scheduled booking and compares it with the current date.
//      The function does this by firstly obtaining the current date and comparing it with the date of the scheduled booking.
// 
// ARGUMENTS:
//      date: Date of the booking data.
//
// RETURNS:
//      If the scheduled booking is in a later date compared to the current date, the function returns true.
//      If the date of the scheduled booking is the same as the current date, the function returns false.
//      If the scheduled booking is in an earlier date compared to the current date, the function returns false.

function checkIfFuture(date)
{
    let now = new Date();

    if (date >= now)
    {
        if (date.getFullYear() > now.getFullYear())
        {
            return true;
        }
        else if (date.getMonth() > now.getMonth())
        {
            return true;
        }
        else if (date.getDate() > now.getDate())
        {
            return true;
        }
    }
    return false;
}


// displayDetails() 
// 
// PURPOSE:
//      This function is responsible for displaying the booking details in the details.html interface.
//      The function gets the specific elements from the details.html page using DOM manipulation.
//      The function then displays the data retrieved using inner.HTML back to the interface.
//      The function also runs a loop through the booking.location, stores the HTML display of the location list into the output variable.
//      Then, the function will display the details regarding the locations for the booking made.
//
// ARGUMENTS:
//      none
//
// RETURNS:
//      None.

function displayDetails() 
{
    const MINIMUM_LOCATIONS_REQ = 2;
    const END_INDEX = booking.locations.length - 1;

    let dateRef = document.getElementById("date");
    let timeRef = document.getElementById("time");
    let stopsRef = document.getElementById("stops");    
    let totalDistanceRef = document.getElementById("totalDistance");
    let taxiTypeRef = document.getElementById("taxiType");
    let totalFareRef = document.getElementById("totalFare");

    dateRef.innerHTML = `<h5>${booking.date.toDateString()}</h5>`;
    timeRef.innerHTML = `<h5>${booking.date.toLocaleTimeString()}</h5>`;
    stopsRef.innerHTML = `<h5>${booking.locations.length - MINIMUM_LOCATIONS_REQ}</h5>`
    totalDistanceRef.innerHTML = `<h5>${booking.totalDistance} km</h5>`;
    taxiTypeRef.innerHTML = `<h5>${booking.taxiType}</h5>`;
    totalFareRef.innerHTML = `<h5> RM ${booking.totalFare}</h5>`;

    let locationsRef = document.getElementById("locations");
    let printedStopWord = 0;
    let output = "";

    for (let i = 0; i < booking.locations.length; i++)
    {
        if (i == 0)
        {
            output += `<h5><b>Initial Location</b></h5>
                        <li class="mdl-list__item mdl-list__item--three-line">
                            <span class="mdl-list__item-primary-content">
                                <span>${booking.locations[i].name}</span>
                                <span class="mdl-list__item-text-body" id="dateTime">${booking.locations[i].address}</span>
                            </span>
                        </li>`;
        }
        else if (i == END_INDEX)
        {
            output += `<h5><b>Final Location</b></h5>
                        <li class="mdl-list__item mdl-list__item--three-line">
                            <span class="mdl-list__item-primary-content">
                                <span>${booking.locations[i].name}</span>
                                <span class="mdl-list__item-text-body" id="dateTime">${booking.locations[i].address}</span>
                            </span>
                        </li>`;
        }
        else
        {
            if (printedStopWord == 0)
            {
                output += `<h5><b>Intermediate Locations</b></h5>`;
                printedStopWord++;
            }

            output += ` <li class="mdl-list__item mdl-list__item--three-line">
                            <span class="mdl-list__item-primary-content">
                                <span>${booking.locations[i].name}</span>
                                <span class="mdl-list__item-text-body" id="dateTime">${booking.locations[i].address}</span>
                            </span>
                        </li>`;
        }
    }

    locationsRef.innerHTML = output;
}

// changeTaxi()
// 
// PURPOSE:
//      This function first creates a reference to the taxi input.
//      The function also creates a reference for the changed taxi input.
//      The function then compares the date of the scheduled booking with the current date using the checkIfFuture function.
//      If the date of the booking is the same as the current date or earlier than the current date, 
//      an alert appears and the function returns.
//      Otherwisse, the function proceeds to check if the input is filled.
//      If it is blank, an alert appears and the function returns.
//      Else, the function will prompt the user to confirm the change in taxi type.
//      Once confirmed, the function will recalculate the distance and fare of the booking.
//      It then displays them onto the HTML page.
//      Function updates the data in the local storage and redirects the user back to the History Page.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function changeTaxi()
{
    let taxiTypeRef = document.getElementById("taxiType");
    let totalDistanceRef = document.getElementById("totalDistance");
    let totalFareRef = document.getElementById("totalFare");

    let taxiTypeChangeRef = document.getElementById("taxiTypeChange");

    if (checkIfFuture(booking.date) == false)
    {
        alert("You are not allowed to change the taxi type as the booking is commencing today or has commenced!")
        return;
    }

    if (taxiTypeChangeRef.value == "")
    {
        alert("Please choose a type of taxi for your booking!");
        return;
    }

    if (confirm("Are you sure you want change the taxi type?"))
    {
        let successfullyAssignedTaxi = assignTaxi(taxiTypeChangeRef.value);

        if (successfullyAssignedTaxi)
        {
            booking.taxiType = taxiTypeChangeRef.value;
            booking.calculateDistance();
            booking.calculateFare();
            
            taxiTypeRef.innerHTML = `<h5>${booking.taxiType}</h5>`;
            totalDistanceRef.innerHTML = `<h5>${booking.totalDistance} km</h5>`;
            totalFareRef.innerHTML = `<h5>RM ${booking.totalFare}</h5>`;
        
            updateData(BOOKING_DATA_KEY,bookingList);

            window.location = "history.html";
        }
        else
        {
            return;
        }
    }
    else
    {
        return;
    }
   
}


// back()
// 
// PURPOSE:
//      This function redirects user back to the history page upon clicking on the "Back" button.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function back()
{
    window.location = "history.html";
}

// cancelBooking()
// 
// PURPOSE:
//      This function is responsible for cancelling the booking by clearing data from the local storage.
//      The function first prompts the user to confirm that they want to cancel the booking.
//      Upon clicking yes, the function clears the booking data from the local storage and the booking list is updated.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function cancelBooking()
{
    if (checkIfFuture(booking.date) == false)
    {
        alert("You are not allowed to cancel the booking as it is commencing today or has commenced!")
        return;
    }
    
    if (confirm("Are you sure you want to cancel this booking?"))
    {
        console.log(bookingList)
        bookingList.removeBooking(index);
        updateData(BOOKING_DATA_KEY, bookingList);
        window.location = "history.html"
    }
    else
    {
        return;
    }
}

// displayAll()
// 
// PURPOSE:
//      This function is responsible for displaying the markers of the locations on the map with pop ups.
//      The function also displays the polyline between the locations.
// 
// ARGUMENTS:
//      locations: Input of locations for the scheduled booking.
//
// RETURNS:
//      None.

function displayAll(locations)
{
    displayMarkerWithPopUp(locations);
    displayPolyLine(locations);
}

// The following lines of code defines a variable for the map. This allows the map to be displayed on the details.html interface.
mapboxgl.accessToken = MAP_BOX_TOKEN;

let map = new mapboxgl.Map({
        container: 'mapDetail',
        center: [101.58113, 3.08872],
        zoom: 15,
        style: 'mapbox://styles/mapbox/streets-v9'
});

let indexExist = checkData(INDEX_KEY);
let booking = "";
let index = "";

if (indexExist)
{
    index = getData(INDEX_KEY);
    restoreMarkers(index);
    booking = bookingList.getBooking(index);

    // Upon accessing the interface and the map loads, the displayAll function will run to display the markers and polyline on the map.
    // The removeMarkers function will also run to remove any existing markers for the array of locations in the booking data.
    map.on('load', function() {
        displayAll(booking.locations);
        removeMarkers(index);
    });

    // Upon accessing the interface, display the booking details in the respective display boxes.
    displayDetails();
}
else
{
    console.log("Local storage is not currently available!")
}





