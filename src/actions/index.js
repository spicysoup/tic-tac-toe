import { GAME } from './types';

export const newMove = (move) => ({
  type: GAME.NEW_MOVE,
  move,
});

export const resetBoard = (player) => ({
  type: GAME.RESET_BOARD,
  player,
});

export const setWinningPath = (winningPath) => ({
  type: GAME.SET_WINNING_PATH,
  winningPath,
});

export const setDraw = (draw) => ({
  type: GAME.SET_DRAW,
  draw,
});

export const setDimension = (dimension, player) => ({
  type: GAME.SET_DIMENSION,
  dimension,
  player,
});

export const joinGame = () => ({
  type: GAME.JOIN_GAME,
});

export const gameJoined = ({ sessionID, player }) => ({
  type: GAME.GAME_JOINED,
  sessionID,
  player,
});

export const serverConnected = (connected = true) => ({
  type: GAME.CONNECTED,
  connected,
});
