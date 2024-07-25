-- cs340 Group 23
-- Team member: Roy Huynh, Colin Cheng
-- Team: Drifters
-- Disable foreign key checks to avoid issues during table creation
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
DROP TABLE IF EXISTS DogAtEvents;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Vaccinations;
DROP TABLE IF EXISTS Dogs;
DROP TABLE IF EXISTS Adopters;

-- Create or replace the table Adopters with the attributes adopterID
-- as primary Key, firstName, lastName, adopterEmail, and phoneNumber.
-- Create tables in the correct order.
CREATE TABLE Adopters (
    adopterID INT(11) AUTO_INCREMENT,
    firstName VARCHAR(145),
    lastName VARCHAR(145),
    adopterEmail VARCHAR(145) DEFAULT NULL,
    phoneNumber VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (adopterID)
);

CREATE TABLE Dogs (
    dogID INT(11) AUTO_INCREMENT,
    adopterID INT,
    dogName VARCHAR(145),
    breed VARCHAR(145),
    sex VARCHAR(45),
    dateOfBirth DATE,
    healthStatus VARCHAR(145),
    PRIMARY KEY (dogID),
    FOREIGN KEY (adopterID) REFERENCES Adopters(adopterID) ON DELETE SET NULL
);

CREATE TABLE Locations (
    locationID INT(11) AUTO_INCREMENT,
    address1 VARCHAR(145),
    address2 VARCHAR(145),
    city VARCHAR(60),
    state VARCHAR(60),
    postalCode VARCHAR(20),
    PRIMARY KEY (locationID)
);

CREATE TABLE Events (
    eventID INT(11) AUTO_INCREMENT,
    locationID INT,
    eventName VARCHAR(145),
    eventDate DATE,
    description VARCHAR(245),
    PRIMARY KEY (eventID),
    FOREIGN KEY (locationID) REFERENCES Locations(locationID) ON DELETE SET NULL
);

CREATE TABLE Vaccinations (
    vaccinationID INT(11) AUTO_INCREMENT,
    dogID INT,
    vaccinationType VARCHAR(60),
    vaccinationDate DATE,
    PRIMARY KEY (vaccinationID),
    FOREIGN KEY (dogID) REFERENCES Dogs(dogID) ON DELETE SET NULL
);

CREATE TABLE DogAtEvents (
    dogEventID INT(11) AUTO_INCREMENT,
    dogID INT NOT NULL,
    eventID INT NOT NULL,
    PRIMARY KEY (dogEventID),
    FOREIGN KEY (dogID) REFERENCES Dogs(dogID) ON DELETE CASCADE,
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE
);


-- Insert 5 rows data to the table Adopters
INSERT INTO Adopters (firstName, lastName, adopterEmail, phoneNumber)
VALUES
('Shelly', 'Williamson', 'swilliamson@toktokmail.com', '(162) 181-0503'),
('Kathleen', 'Randall', 'iamkathleen@networkofemails.org', '(988) 431-8038'),
('Claude', 'Herman', 'hermanclaude@example.com', '(738) 630-6257'),
('Adam', 'Payne', 'nopaynenogain@hotrod.net', '(922) 377-1535'),
('Alyson', 'Montgomery', 'montg.alyson5@totallyrealdomain.com', '(726) 296-1782');

-- Insert 5 rows data to the table Dogs
INSERT INTO Dogs (adopterID, dogName, breed, sex, dateOfBirth, healthStatus)
VALUES
(1, 'Annie', 'Bichon', 'Female', '2018-07-01', 'Healthy'),
(2, 'Argos', 'Labrador', 'Male', '2020-06-01', 'Recovering'),
(2, 'Floppy', 'Poodle', 'Male', '2019-11-30', 'Healthy'),
(3, 'Enzo', 'Chihuahua', 'Male', '2018-02-24', 'Obese'),
(NULL, 'Luna', 'Beagle', 'Female', '2022-05-07', 'Healthy');

-- Insert 4 rows data to the table Vaccinations
INSERT INTO Vaccinations (dogID, vaccinationType, vaccinationDate)
VALUES
(1, 'Rabies', '2023-07-15'),
(2, 'Distemper', '2023-08-20'),
(1, 'Parvovirus', '2023-07-15'),
(3, 'Hepatitis', '2024-01-20');

-- Insert 4 rows data to the table Locations
INSERT INTO Locations (address1, city, state, postalCode)
VALUES
('13212 SE Eastgate Way', 'Bellevue', 'WA', '98005'),
('2608 Center St', 'Tacoma', 'WA', '98409'),
('60 SE Main St', 'Winston', 'OR', '97496'),
('450 Old Del Rio Rd', 'Roseburg', 'OR', '97471');

-- Insert 4 rows data to the table Events
INSERT INTO Events (locationID, eventName, eventDate, description)
VALUES
(1, 'Tuxes and Tails', '2024-05-17', 'Annual fundraising gala showcasing pets and hosting live auctions'),
(2, 'Adoption Day', '2024-09-01', 'Annual Adoption Event'),
(3, 'Fun Walk', '2024-10-05', 'Community Walk for Dogs and Adopters'),
(1, 'Fundraiser Gala', '2024-11-15', 'Gala to raise Funds for FCAT Shelter');

-- Insert 4 row data to the intersection table DogAtEvents
INSERT INTO DogAtEvents (dogID, eventID) 
VALUES
(1, 1),
(2, 1),
(3, 2),
(3, 3),
(4, 4);

-- Enable foreign key checks and commit transactions
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
