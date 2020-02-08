import { combineReducers } from 'redux';
import { SETUP } from 'actions/types';
import game from 'reducers/game';

const setup = (state = {}, action) => {
  switch (action.type) {
    case SETUP.CHOOSE_NAME:
      return { dummyName: action.name };
    case SETUP.RESET:
      return {};
    default:
      return state;
  }
};

export default combineReducers({ setup, game });
