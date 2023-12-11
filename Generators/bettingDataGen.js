const faker = require('faker');

function generateSpread(sport) {
  const spreadRanges = {
    'NBA': { min: 1, max: 14 },
    'NFL': { min: 1, max: 12 },
    'NHL': { min: 1, max: 3 },
    'College Football': { min: 1, max: 26 },
    'Premier League': { min: 1, max: 3 },
    'default': { min: 1, max: 8 }
  };

  const range = spreadRanges[sport] || spreadRanges['default'];
  return faker.datatype.number(range);
}

function generateAmericanOdds(spread) {
  const oddsVariation = faker.datatype.number({ min: 15, max: 30 });
  const oddsDifference = spread * oddsVariation;

  const baseOdds = faker.datatype.number({ min: 130, max: 200 });
  let homeOdds = baseOdds + oddsDifference;
  let awayOdds = baseOdds - oddsDifference;

  homeOdds = Math.max(homeOdds, 100);
  awayOdds = Math.max(Math.abs(awayOdds), 100);

  return faker.datatype.boolean() ? { home: `-${homeOdds}`, away: `+${awayOdds}` } : { home: `+${awayOdds}`, away: `-${homeOdds}` };
}

function generateBettingNumbers(sport) {
  const overUnderRanges = {
    'NBA': { min: 180, max: 230 },
    'NFL': { min: 35, max: 60 },
    'NHL': { min: 4, max: 8 },
    'College Football': { min: 40, max: 80 },
    'Premier League': { min: 2, max: 5 },
    'default': { min: 1, max: 10 }
  };

  const range = overUnderRanges[sport] || overUnderRanges['default'];
  return {
    overUnder: faker.datatype.number(range).toString(),
    spread: generateSpread(sport).toString(),
    odds: generateAmericanOdds(generateSpread(sport))
  };
}



function generateSportsMatch(game) {
  const betting = generateBettingNumbers(game.sport);
  return {
    id: game.id,
    sport: game.sport,
    home: game.home_team_id,
    away: game.away_team_id,
    date: game.game_date,
    odds: betting.odds,
    betting: {
      overUnder: betting.overUnder,
      spread: betting.spread
    },
    result: result
  };
}


module.exports = { generateSportsMatch };
