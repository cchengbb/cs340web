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

app.get('/adopters', function(req, res) 
    {
        let query1 = "SELECT  * FROM Adopters;";

        db.pool.query(query1, function(error, rows, fileds){
            
            res.render('adopters', {data: rows});
        })  
    });

app.get('/dogs', (req, res) => {
    // Declare the query based on whether a search term is provided
    let query1;
    if (req.query.name) {
        // Perform a search if 'name' query string is provided
        query1 = `SELECT * FROM Dogs WHERE name LIKE ?`;
    } else {
        // Default to selecting all dogs
        query1 = "SELECT * FROM Dogs;";
    }

    // Execute the first query to get dogs
    db.pool.query(query1, [`%${req.query.name}%`], (error, dogs, fields) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).send('Database error occurred');
        }

        // Format each date of birth to 'YYYY-MM-DD' before rendering
        dogs.forEach(dog => {
            if (dog.dateOfBirth) {
                dog.dateOfBirth = formatDate(dog.dateOfBirth);
            }
        });

        // Execute the second query to get adopters
        let query2 = "SELECT * FROM Adopters;";
        db.pool.query(query2, (error, adopters, fields) => {
            if (error) {
                console.error('SQL error:', error);
                return res.status(500).send('Database error occurred');
            }

            // Render the page with both sets of data
            res.render('dogs', { dogs: dogs, adopters: adopters });
        });
    });
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

    // Ensure strings and nullable values are handled correctly
    let adopterID = data.adopterID ? `${data.adopterID}` : null;

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

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});