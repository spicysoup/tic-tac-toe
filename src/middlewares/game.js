import { setGameState } from 'libs/gameKeeper';

export default (store) => (next) => (action) => {
  // console.log(store.getState());
  setGameState(store.getState().game);
  next(action);
};
