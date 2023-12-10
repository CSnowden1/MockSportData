const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',  // Replace with your host name
    user: 'root',       // Replace with your database username
    password: '9411',  // Replace with your database password
    database: 'sportsbetting' // Replace with your database name
});

const nbaLeagueId = 17; // Replace with the actual league_id of NBA in your database

const nbaTeams = [
    { name: 'Atlanta United FC', location: 'Atlanta', initials: 'ATL' },
    { name: 'LA Galaxy', location: 'Los Angeles', initials: 'LAG' },
    { name: 'Seattle Sounders FC', location: 'Seattle', initials: 'SEA' },
    { name: 'Portland Timbers', location: 'Portland', initials: 'POR' },
    { name: 'New York City FC', location: 'New York', initials: 'NYC' },
    { name: 'Los Angeles FC', location: 'Los Angeles', initials: 'LAFC' },
    { name: 'Toronto FC', location: 'Toronto', initials: 'TOR' },
    { name: 'Sporting Kansas City', location: 'Kansas City', initials: 'SKC' },
    { name: 'Columbus Crew', location: 'Columbus', initials: 'CLB' },
    { name: 'FC Dallas', location: 'Dallas', initials: 'DAL' },
    { name: 'Minnesota United FC', location: 'Minnesota', initials: 'MIN' },
    { name: 'Philadelphia Union', location: 'Philadelphia', initials: 'PHI' },
    { name: 'Orlando City SC', location: 'Orlando', initials: 'ORL' },
    { name: 'D.C. United', location: 'Washington, D.C.', initials: 'DCU' },
    { name: 'New England Revolution', location: 'New England', initials: 'NER' },
    { name: 'New York Red Bulls', location: 'New York', initials: 'NYRB' },
    { name: 'Chicago Fire FC', location: 'Chicago', initials: 'CHI' },
    { name: 'Houston Dynamo FC', location: 'Houston', initials: 'HOU' },
    { name: 'Real Salt Lake', location: 'Salt Lake City', initials: 'RSL' },
    { name: 'San Jose Earthquakes', location: 'San Jose', initials: 'SJ' }

]

const populateNBATeams = () => {
    nbaTeams.forEach(team => {
        const query = 'INSERT INTO teams (league_id, name, location, initials) VALUES (?, ?, ?, ?)';
        connection.query(query, [nbaLeagueId, team.name, team.location, team.initials], (error, results) => {
            if (error) {
                return console.error('Error:', error.message);
            }
            console.log('Inserted Team:', team.name, 'with ID:', results.insertId);
        });
    });

    connection.end();
};

populateNBATeams();
