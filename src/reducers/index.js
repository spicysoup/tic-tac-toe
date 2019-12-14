import { combineReducers } from 'redux';
import { DUMMY, SETUP } from 'actions/types';

const dummies = (state = [], action) => {
  switch (action.type) {
    case `${DUMMY.LOAD_DUMMIES}_SUCCESS`:
      return action.payload;
    case `${DUMMY.DELETE_DUMMY}_SUCCESS`: {
      const newState = [...state];
      newState.pop();
      return newState;
    }
    default:
      return state;
  }
};

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

export default combineReducers({ dummies, setup });
