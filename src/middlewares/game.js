import { setGameState } from 'libs/gameKeeper';

export default (store) => (next) => (action) => {
  setGameState(store.getState().game);
  next(action);
};
