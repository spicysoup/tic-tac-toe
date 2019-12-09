$(function() {
  const game = {
    board: [[]],
    dimension: 1,
    initialise: function(dimension) {
      this.dimension = dimension;
      this.board = new Array(dimension).fill(new Array(dimension).fill('X'));
    },
  };

  game.initialise(4);

  // console.log(game.board);

  for (let i = 0; i < game.dimension * game.dimension; i++) {
    const coordinates = `${Math.floor(i / game.dimension)},${i % game.dimension}`;
    const $cell = $(`<div class="cell">[${coordinates}]</div>`);
    $cell.css({
      width: `calc(${1 / game.dimension * 100}% - 2px)`,
      height: `calc(${1 / game.dimension * 100}% - 2px)`,
    });
    $cell.attr('data-cell',
        coordinates);
    $('.board').append($cell);
  }

  $('.board').click(function(event) {
    const $target = $(event.target);
    let coordinates;
    if ((coordinates = $target.attr('data-cell'))) {
      console.log(coordinates);
    }
    // console.log($target.attr('data-cell'));
    // console.log(event.target);
  })

});
