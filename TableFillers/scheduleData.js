const mysql = require('mysql');
const util = require('util');
const { generateGameResult } = require('../Generators/gameResultsGen');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9411',
    database: 'sportsbetting'
});

const query = util.promisify(connection.query).bind(connection);

async function updateGameResults() {
    try {
        const pastGames = await query('SELECT * FROM schedule WHERE game_date < NOW() AND status = "pending"');

        for (const game of pastGames) {
            const matchResult = generateGameResult({
                sport: game.league_id, 
                home_team_id: game.home_team_id,
                away_team_id: game.away_team_id,
                game_date: game.game_date
            });

            const winner = matchResult.scoreHome > matchResult.scoreAway ? 'Home' : 'Away';

            await query('UPDATE games SET score_home = ?, score_away = ?, result = ?, status = "played" WHERE game_id = ?', [
                matchResult.scoreHome,
                matchResult.scoreAway,
                winner,
                game.game_id
            ]);
            console.log(`Updated game ${game.game_id} in 'games' table with result: ${winner}`);

            await query('UPDATE schedule SET status = "played", home_score = ?, away_score = ? WHERE game_id = ?', [
                matchResult.scoreHome,
                matchResult.scoreAway,
                game.game_id
            ]);
            console.log(`Updated game ${game.game_id} in 'schedule' table.`);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        connection.end();
    }
}

updateGameResults();
