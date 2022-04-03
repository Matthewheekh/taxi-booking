"Use Strict"
/*
 * Name         : summary.js
 * Purpose      : This file is designed to load second on the summary.html page, and contains code that runs only on that page.
 *                It contains code that displays all the necessary booking information on the map.
 *                It also updates a temporary data using the key. 
 *                
 * Team         : 223
 * Author(s)    : Kevin Lim Jian Hao
 * 
 * Last Modified: 20 May 2021
*/


// displayOutput() 
// 
// PURPOSE:
//      This function is used to display the output at the summary page.
//      It runs a loop through the booking.location, stores the HTML display of the location list into the output variable.
//      It also uses a innner.HTML to display the output.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function displayOutput() 
{
    const MINIMUM_LOCATIONS_REQ = 2;
    const END_INDEX = booking.locations.length - 1;

    let dateRef = document.getElementById("date");
    let timeRef = document.getElementById("time");
    let totalFareRef = document.getElementById("totalFare");
    let taxiTypeRef = document.getElementById("taxiType");
    let totalDistanceRef = document.getElementById("totalDistance");
    let stopsRef = document.getElementById("stops");

    dateRef.innerHTML = `<h5>${booking.date.toDateString()}</h5>`;
    timeRef.innerHTML = `<h5>${booking.date.toLocaleTimeString()}</h5>`;
    totalFareRef.innerHTML = `<h5>RM ${booking.totalFare}</h5>`;
    taxiTypeRef.innerHTML = `<h5>${booking.taxiType}</h5>`;
    totalDistanceRef.innerHTML = `<h5>${booking.totalDistance} km</h5>`;
    stopsRef.innerHTML = `<h5>${booking.locations.length - MINIMUM_LOCATIONS_REQ}</h5>`
    
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


// clearData()
// 
// PURPOSE:
//      This function refreshes the page when it is called by the cancel button in summary page .
// 
// ARGUMENTS:
//      key: 
//
// RETURNS:
//      None.

function clearData(key)
{
    localStorage.removeItem(key);
}


// cancel()
// 
// PURPOSE:
//      This function clears the temporary booking key when it is called by the cancel button in summary page .
//      After that, it takes user back to the main page.
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function cancel()
{
    clearData(SINGLE_BOOKING_KEY);
    window.location = "index.html";
}


// confirm()
// 
// PURPOSE:
//      This function refreshes the page when it is called by the confirm button in summary page .
//      The data on the summary page is store 
//      The booking list is updated
//      A if statement is run 
//
// ARGUMENTS:
//      None.
//
// RETURNS:
//      None.

function confirm()
{
    clearData(SINGLE_BOOKING_KEY);
    bookingList.addBooking(booking);
    updateData(BOOKING_DATA_KEY, bookingList);

    let successfullyAssignedTaxi = assignTaxi(booking.taxiType);
    let bookingPosition = bookingList.bookings.length - 1;

    if (successfullyAssignedTaxi) // 
    {
        window.location = "details.html";
        updateData(INDEX_KEY, bookingPosition);
    }
    else
    {
        window.location = "index.html";
    }
}


let booking = new Booking();
let bookingDataExist = checkData(SINGLE_BOOKING_KEY);

if (bookingDataExist)
{
    let data = getData(SINGLE_BOOKING_KEY);
    booking.fromData(data);
    displayOutput();
}
else
{
    console.log("Local storage is not currently available!");
}



