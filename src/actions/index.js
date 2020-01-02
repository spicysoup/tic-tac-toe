import { DUMMY, GAME } from './types';

export const saveDummy = (dummy) => ({
  type: DUMMY.SAVE_DUMMY,
  dummy,
});

export const deleteDummy = (dummyId) => ({
  type: DUMMY.DELETE_DUMMY,
  dummyId,
});

export const retrieveDummies = () => ({
  type: DUMMY.LOAD_DUMMIES,
});

export const newMove = (move) => ({
  type: GAME.NEW_MOVE,
  move,
});

export const resetBoard = () => ({
  type: GAME.RESET_BOARD,
});

export const setWinningPath = (winningPath) => ({
  type: GAME.SET_WINNING_PATH,
  winningPath,
});

export const setDraw = (draw) => ({
  type: GAME.SET_DRAW,
  draw,
});

export const setDimension = (dimension) => ({
  type: GAME.SET_DIMENSION,
  dimension,
});

export const joinGame = () => ({
  type: GAME.JOIN_GAME,
});

export const gameJoined = ({ sessionID, player }) => ({
  type: GAME.GAME_JOINED,
  sessionID,
  player,
});

export const serverConnected = () => ({
  type: GAME.CONNECTED,
});
