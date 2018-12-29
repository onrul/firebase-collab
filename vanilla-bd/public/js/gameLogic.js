let user = {uid: "A"};
let match = {};
let localPlay = true;
let yourColor = "r";
let selected = null;
let allMoves = [];
let msg = "";
let lastMove = null;

/**
 * init board, init match, draw board and add listener for board clicks
 */
document.addEventListener("DOMContentLoaded", event => {
  initBoard(63);
  match = initMatch( "r","A", "A" );
  setBoard(match.boardState, selected, allMoves);
  document.addEventListener('bdclickevent', e => {
    handleBdClick( e.detail.index, e.detail.code )
  });
});

/**
 * Callback for handling click events on the board
 *
 * @param {int} index index of testSpace
 * @param {string} code e | r | R | b | B
 */
function handleBdClick ( index, code ) {

  // check for remote play and turn
  if ( match.redUID != match.blkUID && yourColor != match.turn.color) {
    console.log(" not your turn");
    return;
  }

  console.log("in the board click", index, code);

  if (code != "e") {  //not empty
    // is there a selected.piece piece already for this turn
    if (code == 'B') {code = 'b'}
    if (code == 'R') {code = 'r'}
    if (code == match.turn.color ) {
      if (selected == index) {
        selected = null;
      } else {
        selected = index;
      }
      allMoves = getPosSpaces(match)
      setBoard(match.boardState, selected, allMoves);
    } else {
      console.log("not selected.piece or wrong color ");
      return;
    }
  } else {
    if ( selected >= 0 ) {
      let rslt = doMove(match, selected, index);
      match = rslt.newMatchState;
      lastMove = rslt.lastMove;
      msg = rslt.msg;
      selected = null;
      allMoves = getPosSpaces(match)
      setBoard(match.boardState, selected, allMoves);
      console.log(msg);
    } else {
      console.log("empty space, no selected piece");
    }
  }
}

function _submitMoveRemote( sel, i, j ) {
  alert(" submitting remote move");
}
