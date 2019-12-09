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

  $('.board').click(function(event) {
    const $target = $(event.target);
    let coordinates;
    if ((coordinates = $target.attr('data-cell'))) {
      const [row, column] = coordinates.split(',').map((c) => parseInt(c));
      if (game.board[row][column] !== '') {
        return;
      }
      console.log(coordinates);
      $target.css({
        lineHeight: $target.css('height')
      });
      const symbol = game.players[game.activePlayer].symbol;
      $target.text(symbol);
      console.log(row, column);
      (game.board[row])[column] = symbol;
      console.log(game.board);
      $target.addClass('no-op');
      swapPlayer();
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
