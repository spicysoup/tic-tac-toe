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
          return completePath;
        }
      }
    }
    return null;
  },

  reset: function() {
    for (let r = 0; r < this.dimension; r++) {
      for (let c = 0; c < this.dimension; c++) {
        this.board[r][c] = '';
      }
    }
  },
};