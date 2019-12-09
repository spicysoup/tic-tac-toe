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
    axis: function() {
      return new Array(this.dimension).fill(0);
    },
    diagonal1: function(withCoordinates = false) {
      const axis = this.axis();

      if (withCoordinates) {
        return axis.map((v, i) => [i, i, this.board[i][i]]);
      } else {
        return axis.map((v, i) => this.board[i][i]);
      }
    },
    diagonal2: function(withCoordinates = false) {
      const axis = this.axis();

      if (withCoordinates) {
        return axis.map((v, i) => [
          i,
          this.dimension - i - 1,
          this.board[i][this.dimension - i - 1]]);
      } else {
        return axis.map((v, i) => this.board[i][this.dimension - i - 1]);
      }
    },

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
      const axis = this.axis();

      const horizontalPath = axis.map(
          (v, i) => [row, i, this.board[row][i]]);

      const verticalPath = axis.map(
          (v, i) => [i, column, this.board[i][column]]);

      const diagonalPath1 = row === column
          ? this.diagonal1(true) : null;

      const diagonalPath2 = row + column + 1 === this.dimension
          ? this.diagonal2(true)
          : null;

      console.log([horizontalPath, verticalPath, diagonalPath1, diagonalPath2]);

      return [horizontalPath, verticalPath, diagonalPath1, diagonalPath2];
    },

    isDraw: function() {
      const axis = this.axis();
      const nonEmpty = (v) => v !== '';
      const allSame = (v, i, a) => v === a[0];

      for (let rc = 0; rc < this.dimension; rc++) {
        if (this.board[rc].filter(nonEmpty).every(allSame)) {
          return false;
        }
        if (axis.map((v, i) => this.board[i][rc]).
            filter(nonEmpty).every(allSame)) {
          return false;
        }
      }
      if (this.diagonal1().filter(nonEmpty).every(allSame)) {
        return false;
      }
      if (this.diagonal2().filter(nonEmpty).every(allSame)) {
        return false;
      }
      return true;
    },

    checkWin: function(row, column) {
      const criticalPaths = this.criticalPaths(row, column);

      const completePaths = criticalPaths.filter(
          (p) => p !== null && !(p.map((v) => v[2]).includes('')));

      for (const completePath of completePaths) {
        for (const player of this.players) {
          if (completePath.map((v) => v[2]).every((w) => w === player.symbol)) {
            console.log(`Player ${player.symbol} won!`);
            console.log(completePath);
            return completePath;
          }
        }
      }
      return null;
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

  const highlightWinners = function($winner, winningPath) {
    const winner = winningPath[0][2];
    console.log('Winner is:', winner);

    winningPath.forEach(([r, c]) => {
      $(`[data-cell="${r},${c}"]`).addClass('winning-cell');
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

      const winningPath = game.checkWin(row, column);
      console.log('Winner:', winningPath);
      if (winningPath !== null) {
        highlightWinners($target, winningPath);
      } else {
        if (game.isDraw()) {
          $('.draw').show();
          console.log('There\'s a draw!');
        }
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
