import { GAME } from 'actions/types';

const initialSessionID = 0;
const initialDimension = 4;
const initialRound = 0;
const players = ['✿', '⚘'];

const togglePlayer = (symbol) => (symbol === players[0]
  ? players[1]
  : players[0]);

const blankMatrix = (dimension = initialDimension) => new Array(dimension).fill(
  '0',
)
// eslint-disable-next-line no-unused-vars
  .map((row) => new Array(dimension).fill(''));

const initialState = {
  connected: false,
  sessionID: initialSessionID,
  dimension: initialDimension,
  round: initialRound,
  player: 0,
  players,
  nextPlayer: players[0],
  matrix: blankMatrix(),
  winningPath: [],
  draw: false,
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

      for (let i = 0; i < state.dimension * state.dimension; i++) {
        matrix[Math.floor(i / state.dimension)][i % state.dimension] = '';
      }

      return {
        ...state,
        round: state.round + 1,
        matrix,
        draw: false,
        winningPath: [],
      };
    }
    case GAME.SET_WINNING_PATH:
      return {
        ...state,
        winningPath: action.winningPath,
      };
    case GAME.SET_DRAW:
      return {
        ...state,
        draw: action.draw,
      };
    case GAME.SET_DIMENSION:
      return {
        ...state,
        sessionID: state.sessionID + 1,
        dimension: action.dimension,
        matrix: blankMatrix(action.dimension),
        draw: false,
        winningPath: [],
      };
    case GAME.CONNECTED:
      return {
        ...state,
        connected: action.connected,
      };
    case GAME.GAME_JOINED: {
      const { sessionID, player } = action;
      return {
        ...state,
        sessionID: parseInt(sessionID, 10),
        player,
      };
    }
    default:
      return state;
  }
};

export default game;
