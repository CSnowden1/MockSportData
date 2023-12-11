const faker = require('faker');

function generateGameResult(game) {
    const scoreRanges = {
        'NBA': { min: 80, max: 120 },
        'NFL': { min: 10, max: 50 },
        'NHL': { min: 1, max: 6 },
        'College Football': { min: 10, max: 60 },
        'Premier League': { min: 0, max: 5 },
        'default': { min: 20, max: 100 }
    };
  
    const range = scoreRanges[game.sport] || scoreRanges['default'];
    const scoreHome = faker.datatype.number(range);
    const scoreAway = faker.datatype.number(range);
    const winner = scoreHome > scoreAway ? 'home' : 'away';
  
    return {
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        winner: winner
    };
  }





  const result = generateGameResult(game);
