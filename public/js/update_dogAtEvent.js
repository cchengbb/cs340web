// Citation for the following function:
// Date: 08/04/2024
// Adapted Based on:
// Source: URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateDogAtEventForm = document.getElementById('update-dogAtEvent-form-ajax');

// Modify the objects we need
updateDogAtEventForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let dogEventID = document.getElementById("update-dogEventID");
    let dogID = document.getElementById("update-dog");
    let eventID = document.getElementById("update-eventID");
   
    // Get the values from the form fields
    let dogEventIDValue = dogEventID.value;
    let dogIDValue = dogID.value;
    let eventIDValue = eventID.value;


    // Put our data we want to send in a javascript object
    let data = {
        dogEventID: dogEventIDValue,
        dogID: dogIDValue,
        eventID: eventIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-dogAtEvent-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // updateRow(xhttp.response, dogNameValue);
            window.location.href ='/dogAtEvents';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, dogEventID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("dogAtEvent-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == dogEventID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of  value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign  to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
