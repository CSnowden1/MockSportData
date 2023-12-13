const faker = require('faker');



function updateRankingPoints(currentPoints, isWinner) {
    // If the team has zero ranking points
    if (currentPoints === 0) {
        return 50;
    }

    // If the team wins and has less than 100 ranking points
    if (isWinner && currentPoints < 100) {
        return 100;
    }

    // Calculate the percentage increase for teams with more than 100 points
    if (isWinner && currentPoints >= 100) {
        let increasePercentage = 0;
        
        if (currentPoints < 200) {
            increasePercentage = 50;
        } else if (currentPoints < 300) {
            increasePercentage = 45;
        } else if (currentPoints < 400) {
            increasePercentage = 40;
        } 
        // ... continue this pattern up to 2000 ...
        else if (currentPoints >= 2000) {
            increasePercentage = 5; // Assuming 5% for 2000 and above
        } else {
                // Logic for losing team (decrease points)
                let decreasePercentage = 0;
        
                if (currentPoints < 200) {
                    decreasePercentage = 10; // Example percentage
                } else if (currentPoints < 300) {
                    decreasePercentage = 9;
                } else if (currentPoints < 400) {
                    decreasePercentage = 8;
                }
                // ... continue this pattern ...
                else if (currentPoints >= 2000) {
                    decreasePercentage = 2; // Example percentage for 2000 and above
                }
        
                // Calculate the new points, ensuring it doesn't go below a certain threshold (e.g., 0)
                const newPoints = Math.round(currentPoints - (currentPoints * decreasePercentage / 100));
                return Math.max(newPoints, 0);
            }

        return Math.round(currentPoints + (currentPoints * increasePercentage / 100));
    }

    // If the team does not win, return the current points
    return currentPoints;
}









function generateGameResult(game, homeRankingPoints, awayRankingPoints,) {
    const totalRankingPoints = homeRankingPoints + awayRankingPoints;

    // Generate a random number within the range of total ranking points
    const randomNumber = faker.datatype.number({ min: 0, max: totalRankingPoints - 1 });

    // Determine the winner based on the range the random number falls in
    const winner = randomNumber < homeRankingPoints ? 'home' : 'away';


    const updatedHomeRankingPoints = updateRankingPoints(homeRankingPoints, winner === 'home');
    const updatedAwayRankingPoints = updateRankingPoints(awayRankingPoints, winner === 'away');

    // Generate base scores for both teams
    const scoreRanges = {
        1: { min: 90, max: 140 },
        2: { min: 10, max: 50 },
        3: { min: 1, max: 8 },
        4: {min: 40, max: 80},
        19: {min: 1, max: 10  },
        10: { min: 10, max: 70 },
        17: { min: 0, max: 5 },
        'default': { min: 20, max: 100 }
    };
  
    const range = scoreRanges[game.sport] || scoreRanges['default'];
    let scoreHome = faker.datatype.number(range);
    let scoreAway = faker.datatype.number(range);

    // Generate a random score difference between 1 and 8
    const scoreDifference = faker.datatype.number({ min: 1, max: 8 });

    // Adjust scores to ensure the winner has the higher score
    if (winner === 'home' && scoreHome <= scoreAway) {
        scoreHome = scoreAway + scoreDifference; // Add random difference to home score
    } else if (winner === 'away' && scoreAway <= scoreHome) {
        scoreAway = scoreHome + scoreDifference; // Add random difference to away score
    }


    return {
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        winner: winner,
        updatedHomeRankingPoints: updatedHomeRankingPoints,
        updatedAwayRankingPoints: updatedAwayRankingPoints
    };
}

const result = generateGameResult(game);
