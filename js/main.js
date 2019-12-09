$(function() {
  class Player {
    constructor(symbol) {
      this.symbol = symbol;
    }
  }

  const game = {
    board: [[]],

    dimension: 1,

    initialise: function(dimension) {
      this.dimension = dimension;

      const matrix = new Array(dimension);
      for (let i = 0; i < dimension; i++) {
        matrix[i] = new Array(dimension).fill('');
      }
      // this.board = new Array(dimension).fill(new Array(dimension).fill('X'));
      this.board = matrix;
    },

    players: [
      new Player('X'),
      new Player('O'),
    ],

    activePlayer: 0,

    /**
     * Returns the "critical paths" - horizontal, vertical and two diagonals - in
     * the following format:
     *
     * [
     *  [[r, c, symbol], [r, c, symbol], [r, c, symbol], [r, c, symbol]], // Horizontal line
     *  [[r, c, symbol], [r, c, symbol], [r, c, symbol], [r, c, symbol]], // Vertical line
     *  [[r, c, symbol], [r, c, symbol], [r, c, symbol], [r, c, symbol]], // Diagonal (r==c)
     *  [[r, c, symbol], [r, c, symbol], [r, c, symbol], [r, c, symbol]], // Diagonal (r + c + 1 == dimension)
     * ]
     * @param row
     * @param column
     * @returns {[*[][], *[][], null, null]}
     */
    criticalPaths: function(row, column) {
      const emptyArray = new Array(game.dimension).fill(0);

      const horizontalPath = emptyArray.map(
          (v, i) => [row, i, this.board[row][i]]);

      const verticalPath = emptyArray.map(
          (v, i) => [i, column, this.board[i][column]]);

      const diagonalPath1 = row === column ? emptyArray.map(
          (v, i) => [i, i, this.board[i][i]]) : null;

      const diagonalPath2 = row + column + 1 === this.dimension
          ? emptyArray.map((v, i) => [
            i,
            this.dimension - i - 1,
            this.board[i][this.dimension - i - 1]])
          : null;

      console.log([horizontalPath, verticalPath, diagonalPath1, diagonalPath2]);

      return [horizontalPath, verticalPath, diagonalPath1, diagonalPath2];
    },
  };

  const buildBoard = function() {
    for (let i = 0; i < game.dimension * game.dimension; i++) {
      const coordinates = `${Math.floor(i / game.dimension)},${i %
      game.dimension}`;
      const $cell = $(`<div class="cell"></div>`);
      $cell.css({
        width: `calc(${1 / game.dimension * 100}% - 2px)`,
        height: `calc(${1 / game.dimension * 100}% - 2px)`,
      });
      $cell.attr('data-cell',
          coordinates);
      $('.board').append($cell);
    }
  };

  const buildPlayers = function() {
    $('.player-a').text(game.players[0].symbol);
    $('.player-b').text(game.players[1].symbol);
  };

  const checkWin = function(row, column) {
    const criticalPaths = game.criticalPaths(row, column);

    const completePaths = criticalPaths.filter(
        (p) => p !== null && !(p.map((v) => v[2]).includes('')));

    for (const completePath of completePaths) {
      for (const player of game.players) {
        if (completePath.map((v) => v[2]).every((w) => w === player.symbol)) {
          console.log(`Player ${player.symbol} won!`);
          console.log(completePath);
          return completePath;
        }
      }
    }
    return null;
  };

  const highlightWinners = function($winner, winningPath) {
    const winner = winningPath[0][2];
    console.log('Winner is:', winner);

    winningPath.forEach(([r, c]) => {
      $(`[data-cell="${r},${c}"]`).addClass("winning-cell");
    });
  };

  $('.board').click(function(event) {
    const $target = $(event.target);
    let coordinates;
    if ((coordinates = $target.attr('data-cell'))) {
      const [row, column] = coordinates.split(',').map((c) => parseInt(c));

      if (game.board[row][column] !== '') {
        return;
      }

      $target.css({
        lineHeight: $target.css('height'),
      });

      const symbol = game.players[game.activePlayer].symbol;
      $target.text(symbol);

      game.board[row][column] = symbol;

      $target.addClass('no-op');

      const winningPath = checkWin(row, column);
      console.log('Winner:', winningPath);
      if (winningPath !== null) {
        highlightWinners($target, winningPath);
      } else {
        swapPlayer();
      }
    }
  });

  const swapPlayer = function() {
    const nextPlayerID = -1 * (game.activePlayer - 1);
    let $nextPlayer = $(`[data-player-id=${nextPlayerID}]`);
    $('.player').removeClass('active-player');
    $nextPlayer.addClass('active-player');
    game.activePlayer = nextPlayerID;
  };

  $('.player').click(function(event) {
    $('.player').removeClass('active-player');
    let $player = $(event.target);
    $player.addClass('active-player');
    game.activePlayer = parseInt($player.attr('data-player-id'));
    console.log(game.players[game.activePlayer].symbol);
  });

  game.initialise(4);
  buildBoard();
  buildPlayers();
});
