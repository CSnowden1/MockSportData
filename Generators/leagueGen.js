const mysql = require('mysql');

// Set up your MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9411',
    database: 'sportsbetting'
});

// Define the leagues data
const leagues = [
    { name: 'MLB', sport_type: 'Baseball', region: 'North America', founded_year: 1901, number_of_teams: 30 },
   ];

// Function to populate leagues
const populateLeagues = () => {
    leagues.forEach(league => {
        const query = 'INSERT INTO leagues (name, sport_type, region, founded_year, number_of_teams) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [league.name, league.sport_type, league.region, league.founded_year, league.number_of_teams], (error, results) => {
            if (error) {
                return console.error('Error:', error.message);
            }
            console.log('Inserted League:', league.name, 'with ID:', results.insertId);
        });
    });

    connection.end();
};

// Run the function
populateLeagues();
