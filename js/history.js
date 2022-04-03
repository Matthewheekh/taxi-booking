"use strict"

/*
 * Name         : history.js
 * Purpose      : This file is designed to load the history of the bookings.
 *                It contains function to assure that the latest booking to be on top for all future bookings, 
 *                commenced bookings and past booking respectively.
 *                It contains functions that loop through every booking and display them.
 *                
 * Team         : 223
 * Author(s)    : Cameron Kon Thai Hin
 * 
 * Last Modified: 20 May 2021
*/


// view() 
// 
// PURPOSE:
//      This function sets the key to a particular index based on user selection.
//      After that, it takes the user to the details html page.
//
// ARGUMENTS:
//      Index: Index of a selected booking.
//
// RETURNS:
//      None.

function view(index)
{
    localStorage.setItem(INDEX_KEY, index);
    window.location = "details.html";
}


// selectSort()
// 
// PURPOSE:
//      This function sorts the bookings with latest date first through selection sort.
//
// ARGUMENTS:
//      bookings; A booking instance.
//
// RETURNS:
//      None.

function selectionSort(bookings)
{
    for (let i = 0; i < bookings.length - 1; i++)
    {
        let minIndex = i;

        for (let j = i + 1; j < bookings.length; j++)
        {
            if (bookings[j].date > bookings[minIndex].date)
            {
                minIndex = j;
            }
        }

        if (minIndex !== i)
        {
            let temp = bookings[i];
            bookings[i] = bookings[minIndex];
            bookings[minIndex] = temp;
        }
    }
}


// displayBookings() 
// 
// PURPOSE:
//      This function is used to display the bookings at the history page.
//      The function gets the specific elements from the index.html page.
//      The function then displays the data retrieved using inner.HTML to the interface.
//      The functionruns a loop through the booking.location, stores the HTML display of the location list into the output variable.
//      Therefore, the function will display the details of the bookings that were made.
//
// ARGUMENTS:
//      bookings: A booking instance.
//
// RETURNS:
//      None.

function displayBookings(bookings)
{    
    let scheduledBookings = document.getElementById("scheduled");
    let currentBookings = document.getElementById("current");
    let pastBookings = document.getElementById("past");

    let scheduledOutput = "";
    let currentOutput = "";
    let pastOutput = "";

    let now = new Date();

    for (let i = 0; i < bookings.length; i++)
    {
        let startLocation = bookings[i].getStartLocation();
        let endLocation = bookings[i].getEndLocation();

        let temporaryOutput = ` <div class="mdl-grid">
                                    <div class="mdl-cell mdl-cell--4-col">
                                        <div class="mdl-grid">
                                            <b>Name: ${bookings[i].bookingName}</b>
                                        </div>
                                        <div class="mdl-grid">
                                            <b>
                                            ${bookings[i].date.toDateString()},
                                            ${bookings[i].locations.length - 2} stops,
                                            ${bookings[i].totalDistance} km,
                                            RM ${bookings[i].totalFare}
                                            </b>
                                        </div>
                                    </div>
                                    <div class="mdl-cell mdl-cell--7-col">
                                        <div class="mdl-grid">
                                            <b>Pick-up Point: ${startLocation.address}</b>
                                        </div>
                                        <div class="mdl-grid">
                                            <b>Final Destination: ${endLocation.address}</b>
                                        </div>
                                    </div>
                                    <div class="mdl-cell mdl-cell--1-col center">
                                        <nav class="mdl-navigation">
                                                <button
                                                    class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                                                    onclick="view(${i})">
                                                    <i class="material-icons">info</i>
                                                </button>
                                            </a>
                                        </nav>
                                    </div>
                                </div>`

        if (bookings[i].date > now)
        {
            if (bookings[i].date.getFullYear() > now.getFullYear())
            {
                scheduledOutput += temporaryOutput;
            }
            else if (bookings[i].date.getMonth() > now.getMonth())
            {
                scheduledOutput += temporaryOutput;
            }
            else if (bookings[i].date.getDate() == now.getDate())
            {
                currentOutput += temporaryOutput; 
            }
            else
            {
                scheduledOutput += temporaryOutput;
            }
        }
        else
        {
            if (bookings[i].date.getFullYear() < now.getFullYear())
            {
                pastOutput += temporaryOutput;
            }
            else if (bookings[i].date.getMonth() < now.getMonth())
            {
                pastOutput += temporaryOutput;
            }
            else if (bookings[i].date.getDate() == now.getDate())
            {
                currentOutput += temporaryOutput; 
            }
            else
            {
                pastOutput += temporaryOutput;
            }
        }

    }

    scheduledBookings.innerHTML = scheduledOutput;
    currentBookings.innerHTML = currentOutput;
    pastBookings.innerHTML = pastOutput;
}


selectionSort(bookingList.bookings);

// Updates the key to sorted booking list
updateData(BOOKING_DATA_KEY, bookingList)
displayBookings(bookingList.bookings);
