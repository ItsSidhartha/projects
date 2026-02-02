
let strikerIndex = 0;
let nonStrikerindex = 1;
let currBowlerIndex = 1;
let target = 0;
let isSecondInning = false;
let inning = 0

function createCommonMsg(maxOver, teams, score, scoreByOver, allBatterStats, strikerIndex, nonStrikerindex, bowlers, currBowlerIndex, allBowlerStats, allBatters) {
  const battingTeam = teams[inning];
  const bowlingTeam = teams[Math.abs(inning - 1)];
  const strikerName = allBatters[inning][strikerIndex];
  const nonStrikerName = allBatters[inning][nonStrikerindex];
  const strikerScore = allBatterStats[inning][strikerIndex][0];
  const ballsFacedByStriker = allBatterStats[inning][strikerIndex][1];
  const nonStrikerScore = allBatterStats[inning][nonStrikerindex][0];
  const ballsFacedBynonStriker = allBatterStats[inning][nonStrikerindex][1];
  const runsScored = score[inning][0];
  const wicketsFallen = score[inning][1];
  const overs = score[inning][2];
  const balls = score[inning][3];
  const neededRunsToWin = target - runsScored;
  const ballsRemaining = (maxOver * 6) - ((overs * 6) + balls);
  const requiredRunsMsg = `need ${neededRunsToWin} in ${ballsRemaining} balls to win`;
  const battingMsg = `
  ${battingTeam}   ${runsScored}/${wicketsFallen} (${overs}.${balls})   ${isSecondInning ? `Target - ${target}` : ''}
  ${isSecondInning ? requiredRunsMsg : ''}                        
  ${strikerName}* - ${strikerScore}(${ballsFacedByStriker})          
  ${nonStrikerName} - ${nonStrikerScore}(${ballsFacedBynonStriker})  
  `;

  const scoresOfcurrentOver = score[inning][3] === 0 && score[inning][2] > 0 ? scoreByOver[inning][overs - 1] : scoreByOver[inning][overs];
  const currOverMsg = `
  This Over - ${scoresOfcurrentOver.join('  ')}
  `;
  const currentBowler = bowlers[inning][currBowlerIndex];
  const oversBowled = allBowlerStats[inning][currBowlerIndex].slice(0, 2).join('.')
  const runsAndWickets = allBowlerStats[inning][currBowlerIndex].slice(2).join('-');

  const bowlingMsg = `
  ${bowlingTeam}  
  ${currentBowler}  ${oversBowled}-${runsAndWickets}
  `;

  return battingMsg + currOverMsg + bowlingMsg;
}

function isEndOfOver(balls) {
  return balls === 6;
}

function setUpNewBatter(allBatterStats) {
  allBatterStats[inning].push([0, 0, 0, 0]);
  return allBatterStats[inning].length - 1;
}

function setUpNewBowler(allBowlerStats) {
  allBowlerStats[inning].push([0, 0, 0, 0]);
  currBowlerIndex = allBowlerStats[inning].length - 1;
}

function getOpeningBatters(allBatterStats) {
  const batter1 = prompt("Enter the opening batter name(striker) :");
  strikerIndex = setUpNewBatter(allBatterStats);
  const batter2 = prompt("Enter the opening batter name(nonStriker) :");
  nonStrikerindex = setUpNewBatter(allBatterStats);
  return [batter1, batter2];
}

function getNewBatter(currentBatters, allBatterStats, allBatters) {
  const newBatter = prompt("Enter the new batter's name(striker) :");
  currentBatters.push(newBatter);
  allBatters[inning].push(newBatter);
  strikerIndex = setUpNewBatter(allBatterStats);
}

function getNewBowler(bowlers, allBowlerStats) {
  const newBowler = prompt("Enter name of new bowler");
  bowlers[inning].push(newBowler);
  setUpNewBowler(allBowlerStats);
}

function getEvent(prompMsg = `Enter what happened this ball\nEnter "wd" for wideball, "nb" for no ball, "w" for wicket`) {
  const validEvents = ['0', '1', '2', '3', '4', '5', '6', 'wd', 'nb', 'w'];
  const event = prompt(prompMsg);
  if (!validEvents.includes(event)) {
    return getEvent(`Invalid Input\nEnter Again`);
  }

  return event;
}

function updateOver(score, scoreByOver, bowlers, allBowlerStats, currBowlerIndex) {
  score[inning][3]++;
  if (isEndOfOver(score[inning][3])) {
    score[inning][3] = 0;
    score[inning][2]++;
    scoreByOver[inning].push([]);
    rotateStrike();
  }
  currBowlerIndex;
}


function updateBowlingStats(allBowlerStats, currBowlerIndex, runs, islegalBall, iswicket = false) {
  allBowlerStats[inning][currBowlerIndex][2] += runs;
  if (islegalBall) {
    allBowlerStats[inning][currBowlerIndex][1]++;
    if (isEndOfOver(allBowlerStats[inning][currBowlerIndex][1])) {
      allBowlerStats[inning][currBowlerIndex][0]++;
      allBowlerStats[inning][currBowlerIndex][1] = 0;
    }
  }
  if (iswicket) {
    allBowlerStats[inning][currBowlerIndex][3]++;
  }
}

function updateBattingStats(allBatterStats, strikerIndex, runs) {
  allBatterStats[inning][strikerIndex][0] += runs;
  allBatterStats[inning][strikerIndex][1]++;

  if (runs === 4) {
    allBatterStats[inning][strikerIndex][2]++;
  }

  if (runs === 6) {
    allBatterStats[inning][strikerIndex][3]++;
  }
}


function updateCurrBatters(currentBatters, allBatters, allBatterStats, strikerIndex) {
  const indexOfBatterToPop = currentBatters.indexOf(allBatters[strikerIndex]);
  indexOfBatterToPop === 0 ? currentBatters.shift() : currentBatters.pop();
  return getNewBatter(currentBatters, allBatterStats, allBatters);
}

function rotateStrike() {
  const temp = strikerIndex;
  strikerIndex = nonStrikerindex;
  nonStrikerindex = temp;
}

function updateScore(score, allBatterStats, strikerIndex, allBowlerStats, currBowlerIndex, scoreByOver, allBatters, currentBatters, bowlers) {
  let event = getEvent();
  let isLegalBall = true;
  let runScored = parseInt(event);

  if (event === 'wd') {
    isLegalBall = false;
    runScored = 1;
    score[inning][0] += runScored;
    updateBowlingStats(allBowlerStats, currBowlerIndex, runScored, isLegalBall);
  } else if (event === 'nb') {
    isLegalBall = false;
    const runsOnNoBall = parseInt(prompt("Enter runs scored on the no ball"));
    runScored = 1 + runsOnNoBall;
    score[inning][0] += runScored;
    event = `${event}+${runsOnNoBall}`
    updateBattingStats(allBatterStats, strikerIndex, runsOnNoBall);

    if (runsOnNoBall % 2 !== 0) {
      rotateStrike();
    }

    updateBowlingStats(allBowlerStats, currBowlerIndex, runScored, isLegalBall);
  } else if (event === 'w') {
    const iswicket = true;
    score[inning][1]++;
    updateCurrBatters(currentBatters, allBatters, allBatterStats, strikerIndex);

    updateBowlingStats(allBowlerStats, currBowlerIndex, 0, isLegalBall, iswicket);
  } else {
    score[inning][0] += runScored;

    updateBattingStats(allBatterStats, strikerIndex, runScored);
    if (runScored % 2 !== 0) {
      rotateStrike();
    }
    updateBowlingStats(allBowlerStats, currBowlerIndex, runScored, isLegalBall);
  }

  scoreByOver[inning][score[inning][2]].push(event);
  if (isLegalBall) {
    updateOver(score, scoreByOver, bowlers, allBowlerStats, currBowlerIndex);
  }
}

function startPlay(score, allBatterStats, strikerIndex, allBowlerStats, currBowlerIndex, scoreByOver, allBatters, currentBatters, bowlers) {
  updateScore(score, allBatterStats, strikerIndex, allBowlerStats, currBowlerIndex, scoreByOver, allBatters, currentBatters, bowlers);
}

function getStartingBattersAndBowlers(allBatterStats, allBowlerStats, bowlers, allBatters) {
  const currentBatters = getOpeningBatters(allBatterStats);
  allBatters[inning].push(currentBatters[0], currentBatters[1]);
  getNewBowler(bowlers, allBowlerStats);
}

function InningBreakMeasage(battingTeam, runsScored, wicketsFallen, overs, balls, bowlingTeam, maxOver) {
  const Msg = `
   ${battingTeam}   ${runsScored}/${wicketsFallen} (${overs}.${balls})
   ${bowlingTeam} needs ${target} in ${maxOver * 6} balls to win
  `
  console.log(Msg)
}

function endMeasage(teams, scoreOfTeam1, scoreOfTeam2, resultMsg) {
  const team1 = teams[0];
  const team2 = teams[1];

  const msg = `
    ${team1}   ${scoreOfTeam1[0]}/${scoreOfTeam1[1]} (${scoreOfTeam1[2]}.${scoreOfTeam1[3]})
    ${team2}   ${scoreOfTeam2[0]}/${scoreOfTeam2[1]} (${scoreOfTeam2[2]}.${scoreOfTeam2[3]})
    ${resultMsg}
  `;
  console.log(msg);
}

function endOfOverMeasage(score, maxOver, teams, allBatterStats) {
  const neededRunsToWin = target - score[1][0];
  const ballsRemaining = (maxOver * 6) - ((score[1][2] * 6) + score[1][3]);
  const requiredRunsMsg = `need ${neededRunsToWin} in ${ballsRemaining} balls to win`;
  const battingTeam = teams[Math.abs(inning - 1)];
  const runsScored = score[inning][0];
  const wicketsFallen = score[inning][1];
  const overs = score[inning][2];
  const balls = score[inning][3];
  const strikerName = allBatters[inning][strikerIndex];
  const strikerScore = allBatterStats[inning][strikerIndex];
  const ballsFacedByStriker = allBatterStats[inning][strikerIndex];

  const nonStrikerName = allBatters[inning][nonStrikerindex];
  const nonStrikerScore = allBatterStats[inning][nonStrikerindex];
  const ballsFacedBynonStriker = allBatterStats[inning][nonStrikerindex];

  const msg = `
  End of Over ${overs} 
  ${battingTeam}   ${runsScored}/${wicketsFallen} (${overs}.${balls})   ${isSecondInning ? `'Target' - ${target}` : ''}
  ${isSecondInning ? requiredRunsMsg : ''}                        
  ${strikerName}* - ${strikerScore}(${ballsFacedByStriker})          
  ${nonStrikerName} - ${nonStrikerScore}(${ballsFacedBynonStriker})  

`
}

function strikeRate(runs, balls) {
  if (balls === 0) {
    return 0;
  }
  
  return Math.round(((runs / balls) * 100));
}

function getBattingDataInString(allBatters, allBatterStats, inning) {
  let dataAsString = '';
  for (let index = 0; index < allBatters[inning].length; index++) {
    dataAsString += `${allBatters[inning][index]} - ${allBatterStats[inning][index][0]}(${allBatterStats[inning][index][1]})  ${strikeRate(allBatterStats[inning][index][0], allBatterStats[inning][index][1])} - ${allBatterStats[inning][index][2]} - ${allBatterStats[inning][index][3]}\n    `
  }
  return dataAsString;
}

function getBowlingDataInString(bowlers, allBowlerStats, inning) {
  let dataAsString = '';
  for (let index = 0; index < bowlers[inning].length; index++) {
    dataAsString += `${bowlers[inning][index]} - ${allBowlerStats[inning][index][0]}.${allBowlerStats[inning][index][1]}-${allBowlerStats[inning][index][2]}-${allBowlerStats[inning][index][3]}\n    `
  }
  return dataAsString;
}

function showFullScoreBoard(teams, result, score, allBatters, allBatterStats, bowlers, allBowlerStats, scoreByOver) {
  const msg = `
        ${teams[0]} - ${score[0][0]}/${score[0][1]}       vs       ${teams[1]} - ${score[1][0]}/${score[1][1]}
              ${result}
                      
                        
    First Innings : 
    Batting : 

    ${getBattingDataInString(allBatters, allBatterStats, 0)}

    Bowling :
 
    ${getBowlingDataInString(bowlers, allBowlerStats, 0)}

${'-'.repeat(100)}

    Second Innings :  
    Batting : 

    ${getBattingDataInString(allBatters, allBatterStats, 1)}

    Bowling :

    ${getBowlingDataInString(bowlers, allBowlerStats, 1)}
    `;

  console.log(msg);
}

function takeOverInput() {
  const overs = parseInt(prompt("Total overs  -  "));
  if (!overs) {
    console.log("Invalid overs");
    return takeOverInput();
  }
  return overs;
}

function main() {
  const team1 = prompt("Team Batting first  -  ");
  const team2 = prompt("Team bowling first  -  ");
  const teams = [team1, team2];

  const maxOver = takeOverInput();
  const allBatterStats = [[], []];
  const allBatters = [[], []];

  const bowlers = [[], []];
  const allBowlerStats = [[], []];
  getStartingBattersAndBowlers(allBatterStats, allBowlerStats, bowlers, allBatters);
  const currentBatters = [allBatters[strikerIndex], allBatters[nonStrikerindex]]
  const score = [[0, 0, 0, 0], [0, 0, 0, 0]];
  const scoreByOver = [[[]], [[]]];
  let measage = createCommonMsg(maxOver, teams, score, scoreByOver, allBatterStats, strikerIndex, nonStrikerindex, bowlers, currBowlerIndex, allBowlerStats, allBatters);
  console.log(measage);
  while (score[inning][2] < maxOver && score[inning][1] < 10) {
    startPlay(score, allBatterStats, strikerIndex, allBowlerStats, currBowlerIndex, scoreByOver, allBatters, currentBatters, bowlers);
    console.clear();
    measage = createCommonMsg(maxOver, teams, score, scoreByOver, allBatterStats, strikerIndex, nonStrikerindex, bowlers, currBowlerIndex, allBowlerStats, allBatters);
    console.log(measage);
    if (score[inning][3] === 0 && score[inning][2] !== maxOver) {
      getNewBowler(bowlers, allBowlerStats);
    }
  }

  target = score[inning][0] + 1;
  console.clear();
  InningBreakMeasage(team1, score[inning][0], score[inning][1], score[inning][2], score[inning][3], team2, maxOver);
  isSecondInning = true;
  inning = 1;
  getStartingBattersAndBowlers(allBatterStats, allBowlerStats, bowlers, allBatters);

  while (score[inning][2] < maxOver && score[inning][1] < 10) {
    startPlay(score, allBatterStats, strikerIndex, allBowlerStats, currBowlerIndex, scoreByOver, allBatters, currentBatters, bowlers);
    console.clear();
    measage = createCommonMsg(maxOver, teams, score, scoreByOver, allBatterStats, strikerIndex, nonStrikerindex, bowlers, currBowlerIndex, allBowlerStats, allBatters);
    console.log(measage);
    if (score[inning][3] === 0 && score[inning][2] !== maxOver) {
      getNewBowler(bowlers, allBowlerStats);
    }

    if (score[inning][0] > score[inning - 1][0]) {
      break;
    }
  }
  const winnerTeam = score[0][0] > score[1][0] ? team1 : team2;
  const winningMargin = winnerTeam === team1 ? `${score[0][0] - score[1][0]} runs` : `${10 - score[1][1]} wickets`;
  const resultMsg = score[0][0] === score[1][0] ? '    Match tied' : `${winnerTeam} won the match by ${winningMargin}`;
  console.clear();
  endMeasage(teams, score[0], score[1], resultMsg);

  const wantScore = confirm("Do you want see the full score board?");
  if (wantScore) {
    showFullScoreBoard(teams, resultMsg, score, allBatters, allBatterStats, bowlers, allBowlerStats, scoreByOver);
  }
}

main();