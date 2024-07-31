/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


PORT = 9613;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.static('public'));

// Helper function to format dates
function formatDate(date) {
    return date.toISOString().substring(0, 10);  // Convert date object to YYYY-MM-DD format
}

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
    
            res.render('index');
      
    });

app.get('/adopters', (req, res) =>
    {
        let query1;

        // If there is no query string, we just perfom a basic SELECT
        if(req.query.lastName === undefined){
            query1 = "SELECT * FROM Adopters;";
        }

        // If there is a query string, we assume this is a search, and return desired restul
        else{
            query1 = `SELECT * FROM Adopters WHERE lastName LIKE "%${req.query.lastName}%"`;
        }

        db.pool.query(query1, function(error, rows, fileds){
            
            res.render('adopters', {data: rows});
        })  
    });


// Dogs Route
app.get('/dogs', (req, res) => {
    let query1;
    // Determine if there is a search query for dog names
    if (req.query.dogName) {
        query1 = `SELECT * FROM Dogs WHERE dogName LIKE '%${req.query.dogName}%'`;
    } else {
        query1 = "SELECT * FROM Dogs;";
    }

    // Execute the query for dogs
    db.pool.query(query1, (error, dogs, fields) => {
        if (error) {
            console.error('SQL error:', error);
            res.status(500).send('Database error occurred');
            return;
        }
        
        // Format each date of birth to 'YYYY-MM-DD' before rendering
        dogs.forEach(dog => {
            if (dog.dateOfBirth) {
                dog.dateOfBirth = formatDate(dog.dateOfBirth);
            }
        });

        // Query to get all adopters
        let query2 = "SELECT * FROM Adopters;";
        db.pool.query(query2, (error, adopters, fields) => {
            if (error) {
                console.error('SQL error:', error);
                res.status(500).send('Database error occurred');
                return;
            }

            // Create a map of adopter IDs to adopter names
            let adopterMap = {};
            adopters.forEach(adopter => {
                adopterMap[adopter.adopterID] = adopter.firstName + ' ' + adopter.lastName;
            });

            // Map adopter names to each dog's adopterID
            dogs = dogs.map(dog => {
                if (dog.adopterID && adopterMap[dog.adopterID]) {
                    return {...dog, adopterID: adopterMap[dog.adopterID]};
                }
                return dog;
            });

            // Render the dogs page with mapped data
            res.render('dogs', {data: dogs, adopters: adopters});
        });
    });
});

// Get Events

app.get('/events', function(req, res)
    {  
        let query1; // Determine query1
        // Search by event name
        if (req.query.eventName) {
            query1 =`SELECT * FROM Events WHERE eventName LIKE '%${req.query.eventName}%'`;
        }
        // Search by event date
        else if (req.query.eventDate) {
            query1 =`SELECT * FROM Events WHERE eventDate LIKE '%${req.query.eventDate}%'`;
        }
        else{
        // Start the SQL query
        query1 = "SELECT * FROM Events;";
        }
    
        let query2 = "SELECT * FROM Locations;";
        db.pool.query(query1, function(error, events, fields){    // Execute the query
            if (error) {
                console.error('SQL error:', error);
                res.status(500).send('Database error occurred');
                return;
            }
            // Iterate over each row and format the date
            events.forEach(event => {
            if (event.eventDate) {
                event.eventDate = formatDate(event.eventDate);
            }
        });

        db.pool.query(query2, function(error, locations, fileds){
            if (error) {
                console.error('SQL error:', error);
                res.status(500).send('Database error occurred');
                return;
            }
            // Create a map of locaiton IDs to location address and city
            let locationMap ={};
            locations.forEach(location =>{
                locationMap[location.locationID] = location.address1 + ', ' + location.city + ', ' + location.state;
            });

            //Map location address to each event's locationID
            events = events.map(event =>{
                if (event.locationID && locationMap[event.locationID]){
                    return{...event, locationID: locationMap[event.locationID]};
                }
                return event;
            })

            // Render the events pat with mapped data
            res.render('events', {data: events, locations: locations});                  // Render the .hbs file, and also send the renderer
        })
     })                                                      
});                                                        

// Get locations
app.get('/locations', (req, res) =>
    {
        let query1;

        // If there query is city
        if(req.query.city){
            query1 = `SELECT * FROM Locations WHERE city LIKE "%${req.query.city}%"`;
            
        }

        // If there query is state
        else if(req.query.state){
            query1 = `SELECT * FROM Locations WHERE state LIKE "%${req.query.state}%"`;
            
        }

        // If there is a query string, we assume this is a search, and return desired restul
        else{
            query1 = "SELECT * FROM Locations;";
        }

        db.pool.query(query1, function(error, rows, fileds){
            
            res.render('locations', {data: rows});
        })  
    });

app.post('/add-adopter-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Ensure strings are handled correctly
    let adopterEmail = data.adopterEmail ? `${data.adopterEmail}` : 'NULL';
    let phoneNumber = data.phoneNumber ? `${data.phoneNumber}` : 'NULL';
    
    // Create the query and run it on the database
    let query1 = `INSERT INTO Adopters(firstName, lastName, adopterEmail, phoneNumber) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.firstName, data.lastName, adopterEmail, phoneNumber], function(error, rows, fields){

        // Check to see if there was an error
        if(error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor to an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Adopters
            let query2 = `SELECT * FROM Adopters;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if(error){

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                     // Format dates before sending response
                     rows.forEach(row => {
                        if (row.dateOfBirth) {
                            row.dateOfBirth = formatDate(row.dateOfBirth);
                        }
                    });
                    res.send(rows);
                }
            });
        }
    });    
});

// POST route to add a new dog
app.post('/add-dog-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let adopterID = parseInt(data.adopterID);
    if (isNaN(adopterID))
    {
        adopterID = null;
    }
    // Create the query and run it on the database
    let query4 = `INSERT INTO Dogs(dogName, breed, healthStatus, sex, dateOfBirth, adopterID) 
                  VALUES (?, ?, ?, ?, ?, ?)`;
    db.pool.query(query4, [data.dogName, data.breed, data.healthStatus, data.sex, data.dateOfBirth, adopterID], function(error, result) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Dogs to get the updated list
            let query5 = `SELECT * FROM Dogs;`;
            db.pool.query(query5, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Post route to add new event
app.post('/add-event-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let locationID = parseInt(data.locationID)
    if (isNaN(locationID))
        {
            locationID = null
        }
    // Create the query and run it on the database
    let query1 = `INSERT INTO Events (locationID, eventName, eventDate, description) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [locationID, data.eventName, data.eventDate, data.description],function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Events
            query2 = `SELECT * FROM Events;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Post route to add new location

app.post('/add-location-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Locations (address1, address2, city, state, postalCode) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(query1, [data.address1, data.address2, data.city, data.state, data.postalCode],function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on locations
            query2 = `SELECT * FROM Locations;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
app.delete('/delete-adopter-ajax', function(req, res, next) {
    let data = req.body;
    console.log('Deleting adopter with ID:', data.adopterID);

    let deleteAdopterQuery = `DELETE FROM Adopters WHERE adopterID = ?`;

    // Execute the query to delete the adopter
    db.pool.query(deleteAdopterQuery, [data.adopterID], function(error, result) {
        if (error) {
            // Log the error and send a 500 status code if there's a database error
            console.error('SQL error:', error);
            res.status(500).send('Failed to delete adopter due to database error');
        } else if (result.affectedRows === 0) {
            // No rows affected, meaning no adopter was found with that ID
            res.status(404).send('No adopter found with that ID');
        } else {
            // Successfully deleted the adopter
            res.sendStatus(204); // 204 No Content
        }
    });
});

app.put('/put-dog-ajax', function(req,res,next){
    let data = req.body;
  
    let adopter = parseInt(data.adopterID);
    let dogName = parseInt(data.dogName);
   

    let updatedogAdopter = `UPDATE Dogs SET adopterID = ? WHERE Dogs.dogID = ?`;
    let adopterIDS = `SELECT * FROM Adopters WHERE adopterID = ?`
  
          // Run the 1st query
          db.pool.query(updatedogAdopter, [adopter, dogName], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(adopterIDS, [adopter], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});