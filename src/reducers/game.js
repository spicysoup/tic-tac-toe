import { GAME } from 'actions/types';

const togglePlayer = (symbol) => (symbol === 'X' ? 'O' : 'X');

const dimension = 12;
const initialState = {
  dimension,
  players: ['X', 'O'],
  nextPlayer: 'X',
  matrix: new Array(dimension).fill('0')
  // eslint-disable-next-line no-unused-vars
    .map((row) => new Array(dimension).fill('')),
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
    default:
      return state;
  }
};

export default game;
