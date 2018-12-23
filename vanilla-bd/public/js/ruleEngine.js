/***********
*  decoupled checkers rules
*
*
*/
// apply the rules of checkers to a move and calculate the new gameState
function doMove ( match, fm, to )  {
  let turn = match.turn;
  let fmcode = match.boardState[fm];
  let tocode = match.boardState[to];
  let isLJ = false;  // is legal jump
  let captured = null;  // index of captured piece

  console.log(fm, to, turn.chain, turn.chainSpace);

  //  check turn, check space is empty
  if (turn.color != fmcode || tocode != "e") {
    return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "Move is illegal 3" };
  }

  if ( fm - to > 5 || to - fm > 5){
    [ isLJ, captured ] = isLegalJump(match, fm, to);
    console.log("[ isLJ, captured ]", isLJ, captured );

    // Check chain first
    if ( isLJ && ((!turn.chain) || (turn.chain && turn.chainSpace == fm))) {
      console.log("jump");
      let code = match.boardState[fm];
      match.boardState = setSpace('e', fm, match.boardState);
      match.boardState = setSpace('e', captured, match.boardState);
      match.boardState = setSpace(code, to, match.boardState);
      if ( hasJump(match, to).length == 0 ) {
        match.turn = {color: 'b', chain: false, chainSpace: null};
        if (code == 'b') {match.turn.color = 'r';}
      } else {
        match.turn = {color: 'b', chain: true, chainSpace: to};
        if (code == 'r') {match.turn.color = 'r';}
      }

      return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "Great Jump!!!" };
    } else {
      return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "WTF ???" };
    }

    // test for a jump
    // if (!turn.chain && isLJ) {
    //   let code = match.boardState[fm];
    //   match.boardState[fm] = 'e';
    //   match.boardState[captured] = 'e';
    //   match.boardState[to] = code;
    //   return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "Move is illegal" };
    // }
  }


  // test for a normal ove
  let jumpNum = getAllJumps(match).length;
  if (jumpNum == 0) {hasAJump = false;} else {hasAJump = true;}

  let isLM = isLegalMv(match, fm, to);
  if (!hasAJump && isLM) {
    let code = match.boardState[fm];
    match.boardState = setSpace('e', fm, match.boardState);
    match.boardState = setSpace(code, to, match.boardState);
    match.turn = {color: 'b', chain: false, chainSpace: null};
    if (code == 'b') {match.turn.color = 'r';}
    return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "Great Move!!" };
  }

  //  illegal move
  return { lastMove: {fm: fm, to: to}, newMatchState: match, msg: "Move is illegal 1" };
}



//  return an array of all possible one space moves from the index
function posMvs(ind, match) {

}

//  return an array of all possible one space jumps from the index
function posJumps(ind) {

}

// returns an array of all possible next moves
function getAllMvs(match) {

}

//  returns an array of all possible jumps in the gameState
function getAllJumps(match) {
  let jumpSet = new Set();
  let code = match.turn.color;
  console.log(code);
  for (let i = 0; i < match.boardState.length; i++) {
    let testPiece = match.boardState[i];
    testCode = testPiece.toLowerCase();
    if ( testCode == code ) {
      let testJumps = hasJump( match, i);
      for (var j = 0; j < testJumps.length; j++) {
        jumpSet.add(testJumps[j]);
      }
    }
  }
  let allJumps = [];
  for (let jump of jumpSet) {
    allJumps.push(jump);
  }
  return allJumps;
}

// returns an array of legal jumps from "fm"
function hasJump (match, fm) {
  let fmcode = match.boardState[fm];
  let targetCode = 'b';
  if (fmcode == 'b' || fmcode == 'B') { targetCode = 'r'}
  let y = Math.floor(fm / 4);
  let oddOffset = (y % 2)
  let x = fm % 4;
  let jumps = [];

  console.log(fmcode, targetCode, x, y);

  let testSpace = match.boardState[ fm + 7 ]
  if ( fmcode != 'b' && y < 6  && testSpace == 'e' && x > 0 ){
    captured = fm + 3 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.push(fm + 7);
    }
  }
  testSpace = match.boardState[ fm + 9 ]
  if ( fmcode != 'b' && y < 6  && testSpace == 'e' && x < 3 ){
    captured = fm + 4 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.push(fm + 9);
    }
  }
  testSpace = match.boardState[ fm - 9 ]
  if( fmcode != 'r' && y > 1  && testSpace == 'e' && x > 0 ){
    captured = fm - 5 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.push(fm - 9);
    }
  }
  testSpace = match.boardState[ fm - 7 ]
  if ( fmcode != 'r' && y > 1  && testSpace == 'e' && x < 3 ){
    captured = fm - 4 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.push(fm - 7);
    }
  }

  return jumps;
}

// boolean  assumes somehas already checked that to is "e"
function isLegalMv(match, fm, to) {
  let fmcode = match.boardState[fm];
  let y = Math.floor(fm / 4);
  let x = fm % 4;
  let odd = (y % 2) ? true: false;;
  let dif = to - fm ;  // shifts odd rows
  // console.log(fmcode, x, y, odd, dif);

  let moves = {sw: false, se: false, nw: false, ne: false}

  moves.sw = fmcode != 'b' && y < 7  && (
    (!odd && dif == 3 && x > 0) || (odd && dif == 4 )
  )
  moves.se = fmcode != 'b' && y < 7  && (
    (odd && dif == 5 && x < 3) || (!odd && dif == 4 )
  )
  moves.nw = fmcode != 'r' && y > 0  && (
    (!odd && dif == -5 && x > 0) || (odd && dif == -4 )
  )
  moves.ne = fmcode != 'r' && y > 0  && (
    (odd && dif == -3 && x < 3) || (!odd && dif == -4 )
  )

  return moves.sw || moves.se || moves.nw || moves.ne;
}

// boolean  assumes somehas already checked that to is "e"
function isLegalJump(match, fm, to) {
  let fmcode = match.boardState[fm];
  let targetCode = 'b';
  if (fmcode == 'b' || fmcode == 'B') { targetCode = 'r'}
  let y = Math.floor(fm / 4);
  let oddOffset = (y % 2)
  let x = fm % 4;
  let dif = to - fm ;  // shifts odd rows
  console.log(fmcode, targetCode, x, y, dif);

  let jumps = {sw: false, se: false, nw: false, ne: false,}
  let isLegalJump = false;
  let captured = null;

  if ( fmcode != 'b' && y < 6  && dif == 7 && x > 0 ){
    captured = fm + 3 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.sw = true;
    }
  }
  if ( fmcode != 'b' && y < 6  && dif == 9 && x < 3 ){
    captured = fm + 4 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.se = true;
    }
  }
  if( fmcode != 'r' && y > 1  && dif == -9 && x > 0 ){
    captured = fm - 5 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.nw = true;
    }
  }
  if ( fmcode != 'r' && y > 1  && dif == -7 && x < 3 ){
    captured = fm - 4 + oddOffset;
    if (match.boardState[captured].toLowerCase() == targetCode) {
      jumps.ne = true;
    }
  }

  console.log(jumps);
  isLegalJump = jumps.sw || jumps.se || jumps.nw || jumps.ne;
  return [ isLegalJump, captured ];
}



// ******************  other functions   *****************

// const startBoard = "eeeeeeerreeebeeeeereebbeeeeereee"; // test red moves
// const startBoard = "eeeerrerrbreebbeeereebbeeeeereee"; // test red moves
const startBoard = "rrrrrrrrrrrreeeeeeeebbbbbbbbbbbb";
// const startBoard = "eeeeeeeeeeeeeeeeeeeerrrrbbbbrrrr";

function initMatch( turnColor,redPlayerUID,blkPlayerUID ) {
  setBoard(startBoard, null, null);
  let stat = "pending";
  if (redPlayerUID && blkPlayerUID) {  // local game?
    stat = "active";
  }
  return {turn: {color: turnColor, chain: false, chainSpace: null},
    boardState: startBoard,
    redUID: redPlayerUID,
    blkUID: blkPlayerUID,
    status: stat
  };
}

function setSpace(chr, index, bdState) {
  return bdState.substr(0,index) + chr + bdState.substr(index+1);
}
