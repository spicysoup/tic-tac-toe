import { GAME } from 'actions/types';

const sessionNumber = 0;
const dimension = 4;
const players = ['✿', '⚘'];

const togglePlayer = (symbol) => (symbol === players[0] ? players[1] : players[0]);

const blankMatrix = () => new Array(dimension).fill('0')
// eslint-disable-next-line no-unused-vars
  .map((row) => new Array(dimension).fill(''));

const initialState = {
  sessionNumber,
  dimension,
  players,
  nextPlayer: players[0],
  matrix: blankMatrix(),
  winningPath: [],
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

      for (let i = 0; i < dimension * dimension; i++) {
        matrix[Math.floor(i / dimension)][i % dimension] = '';
      }

      return {
        ...state,
        sessionNumber: state.sessionNumber + 1,
        matrix,
        winningPath: [],
      };
    }
    case GAME.SET_WINNING_PATH:
      return {
        ...state,
        winningPath: action.winningPath,
      };
    default:
      return state;
  }
};

export default game;
