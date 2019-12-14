import {
  call, fork, put, take,
} from 'redux-saga/effects';
import axios from 'axios';
import { DUMMY } from 'actions/types';

const preAction = (name) => ({
  type: `${name}_REQUESTED`,
});
const successAction = (name, payload) => ({
  type: `${name}_SUCCESS`,
  payload,
});
const errorAction = (name, error) => ({
  type: `${name}_ERROR`,
  error,
});

function* doStuff([name, func]) {
  yield put(preAction(name));
  try {
    const response = yield call(func);
    yield put(successAction(name, response.data));
  } catch (error) {
    yield put(errorAction(name, error));
  }
}

function loadDummies() {
  return axios.get('https://jsonplaceholder.typicode.com/users');
}

function insertOrUpdateDummy(dummy) {
  return axios.post('https://jsonplaceholder.typicode.com/users',
    { payload: dummy });
}

function deleteDummy(dummyId) {
  return axios.delete(`https://jsonplaceholder.typicode.com/users/${dummyId}`);
}

export function* watchLoadDummies() {
  while (true) {
    yield take(DUMMY.LOAD_DUMMIES);
    yield fork(doStuff,
      [DUMMY.LOAD_DUMMIES, loadDummies.bind(null)]);
  }
}

export function* watchSaveDummy() {
  while (true) {
    const { dummy } = yield take(DUMMY.SAVE_DUMMY);
    yield fork(doStuff,
      [DUMMY.SAVE_DUMMY, insertOrUpdateDummy.bind(null, dummy)]);
  }
}

export function* watchDeleteDummy() {
  while (true) {
    const { dummyId } = yield take(DUMMY.DELETE_DUMMY);
    yield fork(doStuff,
      [DUMMY.DELETE_DUMMY, deleteDummy.bind(null, dummyId)]);
  }
}
