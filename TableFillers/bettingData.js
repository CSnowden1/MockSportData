const mysql = require('mysql');
const util = require('util');
const { generateSportsMatch } = require('../Generators/bettingDataGen');

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
        console.log(`Fetched ${pastGames.length} past games to update.`);

        for (const game of pastGames) {
            const matchResult = generateSportsMatch({
                id: game.game_id,
                sport: game.league_id,
                home_team_id: game.home_team_id,
                away_team_id: game.away_team_id,
                game_date: game.game_date
            });

            const existingGame = await query('SELECT * FROM games WHERE game_id = ?', [game.game_id]);

            if (existingGame.length === 0) {
                await query('INSERT INTO games (game_id, date, home_team_id, away_team_id, league_id, home_odds, away_odds, over_under, spread, score_home, score_away, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    game.game_id,
                    matchResult.date,
                    matchResult.home,
                    matchResult.away,
                    matchResult.sport,
                    matchResult.odds.home,
                    matchResult.odds.away,
                    matchResult.betting.overUnder,
                    matchResult.betting.spread,
                    matchResult.result.scoreHome,
                    matchResult.result.scoreAway,
                    "upcoming"
                ]);
                console.log(`Inserted new game ${game.game_id} into 'games' table.`);
                console.log(matchResult);
            } else {
                console.log(`Game ${game.game_id} already exists in 'games' table.`);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        connection.end();
    }
}

updateGameResults();
