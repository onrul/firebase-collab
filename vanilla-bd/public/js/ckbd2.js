/*  Plain vainilla JS checker Board
 *
 *  Should be a webComponent
 *
 */

let bdState = "rrrreeeeeeeeeeeeeeeeeeeeeeeebbbb";
let sel = 8;
let allMvs = "rrrrmmmmeeeeeeeeeeeeeeeeeeeebbbb";

let spWidth = 63;  //  space dimension in pixels
let spCenter = 32;  //  int value of half a space
let indexLookup = []


/**
 * init function to be called by parent in onload.
 * creates DOM elements, sets up event listeners/emmiters and
 * draws an empty board.  needs a <div id="checkerboard">
 *
 * @param {integer} spw  odd integer value for space size in pixels
 * @returns {object} status: ok || error, msg: <text>
 */
function initBoard( spw ) {
  //initialize board indexes
  spWidth = spw;
  spCenter = Math.ceil( spw / 2 );
  console.log("constants", spWidth, spCenter)
  for (var i = 0; i < 32; i++) {
    let yy = Math.floor( i / 4 ) * spWidth + spCenter;
    let xx = ((yy % 2) + (i % 4) * 2) * spWidth + spCenter;
    // indexLookup[i] = { x: xx, y: yy };
    indexLookup[i] = [xx, yy];
  }

  // initialize the canvas
  let oldBoard = document.getElementById('board');
  if ( oldBoard ) {
    oldBoard.parentNode.removeChild(oldBoard);
  }
  let theBoard = document.createElement('canvas');
  let bdSide = (8 * spWidth).toString();
  theBoard.setAttribute("width", bdSide);
  theBoard.setAttribute("height", bdSide);
  theBoard.setAttribute("id", "board");
  document.getElementById('checkerboard').appendChild(theBoard);

  // add the listeners
  let elemLeft = document.getElementById('board').offsetLeft;
  let elemTop = document.getElementById('board').offsetTop;
  document.getElementById('board').addEventListener('click', e => {
    let x = Math.floor((e.pageX - elemLeft) / spWidth);
    let y = Math.floor((e.pageY - elemTop) / spWidth);

    // dispatch event
    let bdClickEvent = new CustomEvent( 'bdclickevent', {
      bubbles: true,
      detail: {
        x: x,
        y: y
      }
    });
    document.dispatchEvent(bdClickEvent);
  });
  setBoard(bdState, sel, allMvs);
}

/**
 * draws the board to a canvas.  First the board is drawn with
 * selected space highlights, then it draws the pieces and
 * then possible moves
 *
 * @param {string} bdState  length == 32, e || r || R || b || B
 * @param {integer} sel index of selected spaces
 * @param {string} allMvs string of move codes????
 * @returns {object} status: ok || error, msg: <text>
 */
function setBoard(bdState, sel, allMvs) {
  // draw the board
  let c = document.getElementById('board');
  let ctx = c.getContext("2d");
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (i % 2 == j % 2) {ctx.fillStyle = "white";}
      else {ctx.fillStyle = "grey";  }
      ctx.fillRect(spWidth * i, spWidth * j, spWidth, spWidth)
    }
  }

  // draw the selected space
  if (sel) {
    let [x, y] = _getXY(sel);
    ctx.fillStyle = "#00dd00";
    ctx.fillRect(x - spCenter, y - spCenter, spWidth, spWidth);
  }

  // draw the pieces
  for (var i = 0; i < bdState.length; i++) {
    let spaceSym = bdState[i];
    switch (spaceSym) {
      case 'e': break;
      case 'r':
        _drawPiece("red", i, ctx);
        break;coors
      case 'R':
        _drawKing("red", i, ctx);
        break;
      case 'b':
        _drawPiece("black", i, ctx);
        break;
      case 'B':
        _drawKing("black", i, ctx);
        break;
    }
  }

  // draw possible moves
  for (var i = 0; i < allMvs.length; i++) {
    if (allMvs[i] == "m") {
      _drawPossibleMove( i, ctx);
    }
  }
}

function setBdState (newState) {
  bdState = newState;
}

function setSel (newSel) {
  sel = newSel;
}

function setAllMvs (newAllMvs) {
  allMvs = newAllMvs;
}

/**
 * sets the status of an individual space.
 *
 * @param {integer} index - of selected spaces
 * @param {string} pc  length == 1, e || r || R || b || B
 * @returns {object} status: ok || error, msg: <text>
 */
function setSpace( index, pc ) {
  return { status: "ok", msg: "you are a programming GOD"};
}

/**
 * sets the selection status of an individual space.
 *
 * @param {integer} index - of selected spaces
 * @param {boolean} isSelected  turn on or off?
 * @returns {object} status: ok || error, msg: <text>
 */
function setSelection( index, isSelected ) {
  return { status: "ok", msg: "you are a programming GOD"};
}

function _drawPiece( color, index, ctx ) {
  let [x, y] = _getXY(index);
  ctx.beginPath();
  let radius = Math.ceil(spWidth * .4)
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill()
}

function _drawKing( color, index, ctx ) {
  let [x, y] = _getX(index);
  ctx.beginPath();
  let radius = Math.ceil(spWidth * .4)
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill()
  ctx.beginPath();
  let smradius = Math.ceil(spWidth * .2)
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill()
}

function _drawPossibleMove(index, ctx) {
  let [x, y] = _getXY(index);
  ctx.beginPath();
  let radius = Math.ceil(spWidth * .1)
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.fill()
}


function _getXY ( index ) {
  if (index >= 0 && index <= 31) {
    return indexLookup[index];
  }
  alert("wtf")
}