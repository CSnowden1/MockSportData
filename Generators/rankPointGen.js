const mysql = require('mysql');
const util = require('util');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9411',
    database: 'sportsbetting'
});

// Promisify the query so we can use async/await
const query = util.promisify(connection.query).bind(connection);

const generateInitialRankings = async (leagueId) => {
    try {
        const teams = await query('SELECT team_id FROM teams WHERE league_id = ?', [leagueId]);
        const teamCount = teams.length;
        const totalPoints = teamCount * 100;
        
        let remainingPoints = totalPoints;
        const teamPoints = {};

        for (let i = 0; i < teams.length; i++) {
            let points = i < teams.length - 1 ? Math.floor(Math.random() * remainingPoints) : remainingPoints;
            remainingPoints -= points;
            teamPoints[teams[i].team_id] = points;
        }

        const sortedTeams = Object.keys(teamPoints).sort((a, b) => teamPoints[b] - teamPoints[a]);

        for (let i = 0; i < sortedTeams.length; i++) {
            let teamId = sortedTeams[i];
            await query('UPDATE teams SET rank_points = ?, current_rank = ? WHERE team_id = ?', [teamPoints[teamId], i + 1, teamId]);
        }

        console.log('Rankings initialized for league:', leagueId);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        connection.end();
    }
};

generateInitialRankings(17); // Replace 1 with your actual league_id
