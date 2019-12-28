import { GAME } from 'actions/types';

const togglePlayer = (symbol) => (symbol === 'X' ? 'O' : 'X');

const sessionNumber = 0;
const dimension = 4;
const blankMatrix = () => new Array(dimension).fill('0')
// eslint-disable-next-line no-unused-vars
  .map((row) => new Array(dimension).fill(''));
const initialState = {
  sessionNumber,
  dimension,
  players: ['X', 'O'],
  nextPlayer: 'X',
  matrix: blankMatrix(),
};

const game = (state = initialState, action) => {
  switch (action.type) {
    case GAME.NEW_MOVE: {
      const matrix = [...state.matrix];
      // eslint-disable-next-line prefer-destructuring
      matrix[action.move[0]][action.move[1]] = action.move[2];
      return {
        ...state,
        matrix,
        lastMove: action.move,
        nextPlayer: togglePlayer(action.move[2]),
      };
    }
    case GAME.RESET_BOARD: {
      const matrix = [...state.matrix];
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j] = '';
        }
      }

      console.log(matrix);
      return {
        ...state,
        sessionNumber: state.sessionNumber + 1,
        matrix,
      };
    }
    default:
      return state;
  }
};

export default game;
