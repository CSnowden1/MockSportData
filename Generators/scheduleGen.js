require('dotenv').config();

const mysql = require('mysql');
const util = require('util');
const moment = require('moment');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9411',
    database: 'sportsbetting'
});
// Promisify the query function
const query = util.promisify(connection.query).bind(connection);

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const generateSchedule = async (leagueId, startDate) => {
    try {
        const teams = await query('SELECT team_id FROM teams WHERE league_id = ?', [leagueId]);
        if (teams.length < 20) {
            throw new Error('League must have at least 20 teams for a 10-game schedule');
        }

        let gameDate = moment(startDate, 'YYYY-MM-DD');
        const totalGames = 10;
        let schedule = [];

        for (let game = 0; game < totalGames; game++) {
            let shuffledTeams = shuffleArray([...teams]);
            for (let i = 0; i < shuffledTeams.length; i += 2) {
                const homeTeam = shuffledTeams[i].team_id;
                const awayTeam = shuffledTeams[i + 1].team_id;
                const gameTime = (i / 2) % 2 === 0 ? '13:00:00' : '16:30:00';
                schedule.push({
                    home: homeTeam,
                    away: awayTeam,
                    date: gameDate.clone().add(game, 'weeks').format(`YYYY-MM-DD ${gameTime}`)
                });
            }
        }

        for (const game of schedule) {
            await query('INSERT INTO schedule (home_team_id, away_team_id, game_date, league_id, status) VALUES (?, ?, ?, ?, "pending")', [game.home, game.away, game.date, leagueId]);
            console.log(`Scheduled game for league ${leagueId}: ${game.home} vs ${game.away} on ${game.date}`);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        connection.end();
    }
};

generateSchedule(1, '2023-11-5');
