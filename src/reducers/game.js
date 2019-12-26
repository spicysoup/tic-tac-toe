import { GAME } from 'actions/types';

const togglePlayer = (symbol) => (symbol === 'X' ? 'O' : 'X');

const game = (state = { nextPlayer: 'X' }, action) => {
  switch (action.type) {
    case GAME.NEW_MOVE:
      return { ...state, lastMove: action.move, nextPlayer: togglePlayer(action.move[2]) };
    default:
      return state;
  }
};

export default game;
