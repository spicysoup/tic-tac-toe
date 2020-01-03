let dimension;
let matrix;
let axis;

export const setGameState = (game) => {
  ({ dimension, matrix } = game);
  axis = new Array(dimension).fill(0);
};

export const getMatrix = () => matrix;

/**
 * Diagonal of the board - top-left to bottom-right.
 *
 * @param withCoordinates Whether or not to include the coordinates along with the cell content.
 * @returns {*[][]|*[]}
 */
const diagonal1 = (withCoordinates = false) => {
  if (withCoordinates) {
    return axis.map((v, i) => [i, i, matrix[i][i]]);
  }
  return axis.map((v, i) => matrix[i][i]);
};

/**
 * Diagonal of the board - top-right to bottom-left.
 *
 * @param withCoordinates Whether or not to include the coordinates along with the cell content.
 * @returns {*[][]|*[]}
 */
const diagonal2 = (withCoordinates = false) => {
  if (withCoordinates) {
    return axis.map((v, i) => [
      i,
      dimension - i - 1,
      matrix[i][dimension - i - 1]]);
  }
  return axis.map((v, i) => matrix[i][dimension - i - 1]);
};

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
const criticalPaths = (row, column) => {
  const horizontalPath = axis.map((v, i) => [row, i, matrix[row][i]]);

  const verticalPath = axis.map((v, i) => [i, column, matrix[i][column]]);

  const diagonalPath1 = row === column ? diagonal1(true) : null;

  const diagonalPath2 = row + column + 1 === dimension
    ? diagonal2(true)
    : null;

  return [horizontalPath, verticalPath, diagonalPath1, diagonalPath2];
};

/**
 * Find out if there's a draw.
 * There is a draw when each row, column and diagonal has at least two different symbols.
 *
 * @returns {boolean}
 */
export const isDraw = () => {
  const nonEmpty = (v) => v !== null;
  const allSame = (v, i, a) => v === a[0];

  for (let rc = 0; rc < dimension; rc++) {
    if (matrix[rc].filter(nonEmpty).every(allSame)) {
      return false;
    }
    // eslint-disable-next-line no-loop-func
    if (axis.map((v, i) => matrix[i][rc]).filter(nonEmpty).every(allSame)) {
      return false;
    }
  }
  if (diagonal1().filter(nonEmpty).every(allSame)) {
    return false;
  }
  if (diagonal2().filter(nonEmpty).every(allSame)) {
    return false;
  }
  return true;
};

/**
 * Check if the given cell has caused a winning situation.
 *
 * @param row
 * @param column
 * @returns {null|T} The winning path
 */
export const checkWin = (row, column) => {
  const paths = criticalPaths(row, column);
  const completePaths = paths.filter(
    (p) => p !== null && !(p.map((v) => v[2]).includes(null)),
  );

  for (const completePath of completePaths) {
    for (const player of [0, 1]) {
      if (completePath.map((v) => v[2]).every((w) => w === player)) {
        return completePath;
      }
    }
  }

  return null;
};
